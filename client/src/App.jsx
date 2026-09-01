import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes/Router";
import GlobalLoader from "./components/feedback/loading/GlobalLoader";

function App() {
  return (
    <Suspense fallback={<GlobalLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
