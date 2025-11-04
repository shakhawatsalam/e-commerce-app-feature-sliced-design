import { Suspense, useEffect } from "react";


import { AppRouter } from "@/app/providers";

import { refreshSession, userActions } from "@/entities/user";

import { setAuthFailureHandler } from "@/shared/api";
import { useAppDispatch } from "@/shared/lib";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(userActions.initUserData());
    dispatch(refreshSession());
    setAuthFailureHandler(() => {
      dispatch(userActions.clearUserData());
    });
  }, [dispatch]);
  return (
    <>
      <Suspense fallback={<></>}>
        <AppRouter />
      </Suspense>
    </>
  );
}

export default App;
