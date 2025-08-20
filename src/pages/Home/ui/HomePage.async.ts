/* eslint-disable @typescript-eslint/ban-ts-comment */
import { lazy } from "react";

export const HomePageAsync = lazy(
  () =>
    new Promise((resolve) => {
      //@ts-expect-error
      setTimeout(() => resolve(import("./HomePage")), 1500);
    })
);
