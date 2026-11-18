import { Outlet } from "react-router-dom";

import AuthenticatedNavbar from "@/components/layout/AuthenticatedNavbar";

export const RootLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AuthenticatedNavbar />

      <main>
        <Outlet />
      </main>
    </div>
  );
};
