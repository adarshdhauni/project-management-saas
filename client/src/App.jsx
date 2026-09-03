import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";

import router from "./routes/Router";
import GlobalLoader from "./components/feedback/loading/GlobalLoader";
import { Toaster } from "@/components/ui/toast";

function App() {
  return (
    <Toaster>
      <Suspense fallback={<GlobalLoader />}>
        <RouterProvider router={router} />
      </Suspense>
    </Toaster>
  );
}

export default App;
