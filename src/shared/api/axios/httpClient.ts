import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";

import { API_URL, LOCAL_STORAGE_USER_KEY } from "@/shared/config";

// Extend AxiosRequestConfig to add a custom _retry flag to track retried requests
interface ExtendedAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// Define a callback type for handling queued requests during token refresh
type QueueCallback = (success: boolean, error?: AxiosError) => void;

// Custom error type for token refresh failures, including the original error
interface RefreshError extends Error {
  isRefreshedError: true;
  originalError: AxiosError;
}

// Create an Axios instance (httpClient) for making HTTP requests
export const httpClient = axios.create({
  baseURL: API_URL, // Base URL for all requests (e.g., https://myapi.com)
  withCredentials: true, // Include cookies or auth data in requests
  timeout: 10000, // Wait 10 seconds before giving up on a request
});

// Flag to track if a token refresh is in progress
let isRefreshing = false;
// Queue to hold requests waiting for token refresh
const refreshQueue: QueueCallback[] = [];
// Timeout for refresh requests (15 seconds)
const REFRESH_TIMEOUT = 15000;

// Add a callback to the refresh queue to wait for token refresh
const subscribeRefresh = (cb: QueueCallback) => {
  refreshQueue.push(cb); // Add callback to the queue
};

// Process all queued requests after refresh completes
const flushQueue = (error: AxiosError | null, success: boolean) => {
  while (refreshQueue.length) {
    const cb = refreshQueue.shift(); // Get the next callback
    if (cb) {
      cb(success, error || undefined); // Run callback with success or error
    }
  }
};

// Create a custom error for failed token refreshes
const createRefreshError = (originalError: AxiosError): RefreshError => {
  const refreshError = new Error("Token refresh failed") as RefreshError;
  refreshError.isRefreshedError = true; // Mark as refresh error
  refreshError.originalError = originalError; // Store original error
  return refreshError;
};

// Check if an error is due to network issues (e.g., no internet, timeout)
const isNetworkError = (error: AxiosError) => {
  return (
    !error.response && // No response from server
    (error.code === "ECONNABORTED" || // Request timed out
      error.code === "ENOTFOUND" || // Server not found
      error.code === "ECONNRESET" || // Connection reset
      error.message.includes("timeout")) // Timeout error
  );
};

// Log errors in development mode for debugging
const logError = (context: string, error: unknown) => {
  if (import.meta.env.DEV) {
    // Only log in development environment
    console.log(`HTTP CLIENT ${context}:`, error);
  }
};

// Add a response interceptor to handle errors (e.g., 401 Unauthorized)
httpClient.interceptors.response.use(
  (response: AxiosResponse) => response, // Pass successful responses through
  async (error: AxiosError) => {
    // Get the HTTP status code and original request config
    const status = error?.response?.status;
    const originalConfig = error?.config as
      | ExtendedAxiosRequestConfig
      | undefined;

    // Log error details for debugging
    logError("response interceptor", {
      status,
      url: originalConfig?.url,
      method: originalConfig?.method,
      message: error.message,
    });

    // If no original config, reject the error
    if (!originalConfig) {
      return Promise.reject(error);
    }

    // Skip retry if not a 401 error or if already retried
    if (status !== 401 || originalConfig?._retry) {
      return Promise.reject(error);
    }
    // Skip if the request is to the refresh endpoint itself
    if (originalConfig?.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    // Mark the request as retried
    originalConfig._retry = true;

    // If no refresh is in progress, start one
    if (!isRefreshing) {
      isRefreshing = true; // Lock to prevent multiple refreshes

      try {
        // Try to refresh the token by calling /auth/refresh
        const refreshResponse = await httpClient.post(
          "/auth/refresh",
          {},
          {
            timeout: REFRESH_TIMEOUT, // 15-second timeout for refresh
            transformResponse: [(data) => data], // Return raw response data
          }
        );
        // Log successful refresh
        logError("success refresh", {
          status: refreshResponse.status,
        });
        isRefreshing = false; // Unlock refresh
        flushQueue(null, true); // Process queued requests with success
        return httpClient(originalConfig); // Retry original request
      } catch (refreshError) {
        isRefreshing = false; // Unlock refresh
        const AxiosRefreshError = refreshError as AxiosError;
        // Log refresh failure
        logError("refresh failed", {
          status: AxiosRefreshError?.response?.status,
          message: AxiosRefreshError.message,
          isNetworkError: isNetworkError(AxiosRefreshError),
        });

        // Clear user data from localStorage (like logging out)
        try {
          localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
        } catch (storageError) {
          logError("storage clear error", storageError);
        }

        // Run auth failure handler if set
        if (authFailureHandler) {
          try {
            authFailureHandler(AxiosRefreshError);
          } catch (handlerError) {
            logError("auth failure handler error", handlerError);
          }
        }
        // Reject all queued requests with error
        flushQueue(AxiosRefreshError, false);
        return Promise.reject(createRefreshError(AxiosRefreshError));
      }
    }

    // If refresh is already in progress, queue this request
    return new Promise<AxiosResponse>((resolve, reject) => {
      subscribeRefresh((success: boolean, refreshError?: AxiosError) => {
        if (success) {
          // Retry original request if refresh succeeded
          httpClient(originalConfig).then(resolve).catch(reject);
        } else {
          // Reject with refresh error or original error
          const finalError = refreshError
            ? createRefreshError(refreshError)
            : error;
          reject(finalError);
        }
      });
    });
  }
);

// Define a handler for authentication failures (e.g., redirect to login)
type AuthFailureHandler = (error?: AxiosError) => void;
let authFailureHandler: AuthFailureHandler | null = null;

// Set a custom auth failure handler
export const setAuthFailureHandler = (handler: AuthFailureHandler) => {
  authFailureHandler = handler; // Store the handler
};

// Check if an error is a refresh error
export const isRefreshError = (error: unknown): error is RefreshError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "isRefreshError" in error &&
    error.isRefreshError === true
  );
};
