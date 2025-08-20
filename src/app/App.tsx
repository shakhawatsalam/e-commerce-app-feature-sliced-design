import { AppRouter } from "@/app/providers";
import { Suspense } from "react";

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
