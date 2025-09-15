import { Suspense } from "react";

import { AppRouter } from "@/app/providers";

function App() {
  return (
    <>
      <Suspense fallback={<></>}>
        <AppRouter />
      </Suspense>
    </>
  );
}

export default App;
