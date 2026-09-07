import AuthenticatedNavbar from "@/components/layout/AuthenticatedNavbar";
import PageTransition from "@/components/shared/PageTransition";
import { Outlet } from "react-router-dom";

export const RootLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AuthenticatedNavbar />

      <main>
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
    </div>
  );
};