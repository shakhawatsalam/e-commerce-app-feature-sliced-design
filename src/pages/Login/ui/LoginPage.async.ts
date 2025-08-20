/* eslint-disable @typescript-eslint/ban-ts-comment */
import { lazy } from "react";

export const LoginPageAsync = lazy(
  () =>
    new Promise((resolve) => {
      //@ts-expect-error
      setTimeout(() => resolve(import("./LoginPage")), 1500);
    })
);
