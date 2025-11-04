import { API_URL } from "./api/api";
import {
  AuthMethod,
  AuthProviders,
  type AuthProvidersType,
  type AuthMethodType,
  LOCAL_STORAGE_USER_KEY,
} from "./auth/auth";
import {
  type SupportedLngsType,
  languageIconList,
} from "./i18n/LanguageIconList";
import { routePaths, AppRoutes } from "./router/routePaths";
import {
  Theme,
  ThemeContext,
  LOCAL_STORAGE_THEME_KEY,
  type ThemeType,
} from "./theme/ThemeContext";
import { useTheme } from "./theme/useTheme";

export {
  routePaths,
  AppRoutes,
  Theme,
  ThemeContext,
  LOCAL_STORAGE_THEME_KEY,
  LOCAL_STORAGE_USER_KEY,
  languageIconList,
  useTheme,
  AuthProviders,
  AuthMethod,
  API_URL,
  type AuthProvidersType,
  type AuthMethodType,
  type ThemeType,
  type SupportedLngsType,
};
