import { Outlet } from "react-router-dom";

import ScrollToTop from "@/routes/ScrollToTop";

export const AppLayout = () => {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
};
