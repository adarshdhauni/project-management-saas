import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";

import { Toaster } from "@/components/ui/toast";

import GlobalLoader from "./components/feedback/loading/GlobalLoader";
import AuthInitializer from "./features/auth/components/AuthInitializer";
import router from "./routes/Router";

function App() {
  return (
    <Toaster>
      <AuthInitializer>
        <Suspense fallback={<GlobalLoader />}>
          <RouterProvider router={router} />
        </Suspense>
      </AuthInitializer>
    </Toaster>
  );
}

export default App;
