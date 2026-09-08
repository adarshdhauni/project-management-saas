import ScrollToTop from "@/routes/ScrollToTop";
import { Outlet } from "react-router-dom";

export const AppLayout = () => {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
};
