import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";

import router from "./routes/Router";
import GlobalLoader from "./components/feedback/loading/GlobalLoader";
import { Toaster } from "@/components/ui/toast";
import AuthInitializer from "./features/auth/components/AuthInitializer";

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
