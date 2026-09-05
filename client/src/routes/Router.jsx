import { createBrowserRouter, Outlet } from "react-router-dom";
import React, { lazy } from "react";

const Register = lazy(() => import("@/pages/auth/Register"));
const Login = lazy(() => import("@/pages/auth/Login"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword"));
const Dashboard = lazy(() => import("@/pages/user/Dashboard"));
const Home = lazy(() => import("@/pages/public/Home"));

import ScrollToTop from "./ScrollToTop";
import ProtectedRoute from "./ProtectedRoute";

const AppLayout = () => {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
};

const AuthLayout = () => (
  <div className="flex min-h-screen items-center justify-center bg-background px-5 py-8 text-foreground sm:px-6 sm:py-12">
    <div className="w-full max-w-125">
      <Outlet />
    </div>
  </div>
);

const RootLayout = () => {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
};

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/auth",
        element: <AuthLayout />,
        children: [
          {
            path: "register",
            element: <Register />,
          },
          {
            path: "login",
            element: <Login />,
          },
          {
            path: "forgot-password",
            element: <ForgotPassword />,
          },
          {
            path: "reset-password/:token",
            element: <ResetPassword />,
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <RootLayout />,
            children: [
              {
                path: "/",
                element: <Dashboard />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
