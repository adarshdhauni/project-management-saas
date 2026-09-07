import PageTransition from "@/components/shared/PageTransition";
import { Outlet } from "react-router-dom";

export const AuthLayout = () => (
  <div className="flex min-h-screen items-center justify-center bg-background px-5 py-8 text-foreground sm:px-6 sm:py-12">
    <PageTransition className="w-full max-w-125">
      <Outlet />
    </PageTransition>
  </div>
);
