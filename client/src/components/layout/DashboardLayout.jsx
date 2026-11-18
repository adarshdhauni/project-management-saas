import { Outlet } from "react-router-dom";

import PageTransition from "@/components/shared/PageTransition";

export const DashboardLayout = () => {
  return (
    <PageTransition>
      <Outlet />
    </PageTransition>
  );
};

