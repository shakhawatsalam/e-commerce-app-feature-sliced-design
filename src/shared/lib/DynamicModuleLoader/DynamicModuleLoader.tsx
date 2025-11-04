import type { Reducer } from "@reduxjs/toolkit";
import { useEffect, type ReactNode } from "react";
import { useStore } from "react-redux";

import type {
  ReduxStoreWithManager,
  StateSchema,
  StateSchemaKey,
} from "@/app/store";

import { useAppDispatch } from "../redux/hooks";

export type ReducerList = {
  [name in StateSchemaKey]?: Reducer<NonNullable<StateSchema[name]>>;
};

interface DynamicModuleLoaderProps {
  reducer: ReducerList;
  removeAfterUnmount?: boolean;
  children: ReactNode;
}

export const DynamicModuleLoader = (props: DynamicModuleLoaderProps) => {
  const { children, reducer, removeAfterUnmount } = props;
  const store = useStore() as ReduxStoreWithManager;
  const dispatch = useAppDispatch();

  useEffect(() => {
    const mounted = store.reducerManager.getMoundedReducer();
    Object.entries(reducer).forEach(([name, reducer]) => {
      const key = name as StateSchemaKey;
      if (!mounted[key]) {
        store.reducerManager.add(key, reducer);
        dispatch({ type: `@INIT async reducer ${key}` });
      }
    });

    return () => {
      if (!removeAfterUnmount) return;
      Object.entries(reducer).forEach(([name]) => {
        const key = name as StateSchemaKey;

        store.reducerManager.remove(key);
        dispatch({ type: `@DESTROY async reducer ${key}` });
      });
    };
  }, []);
  return children;
};
