import { createBrowserRouter } from "react-router-dom";
import React, { lazy } from "react";

const Register = lazy(() => import("@/pages/auth/Register"));
const Login = lazy(() => import("@/pages/auth/Login"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword"));
const Home = lazy(() => import("@/pages/public/Home"));
const Dashboard = lazy(() => import("@/pages/user/Dashboard"));
const Notification = lazy(() => import("@/pages/user/Notification"));
const Profile = lazy(() => import("@/pages/user/Profile"));
const Settings = lazy(() => import("@/pages/user/Settings"));

import ProtectedRoute from "./ProtectedRoute";

import { AppLayout } from "@/components/layout/AppLayout";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { RootLayout } from "@/components/layout/RootLayout";

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
                path: "/dashboard",
                children: [
                  {
                    index: true,
                    element: <Dashboard />,
                  },
                  {
                    path: "notifications",
                    element: <Notification />,
                  },
                  {
                    path: "profile",
                    element: <Profile />,
                  },
                  {
                    path: "settings",
                    element: <Settings />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
