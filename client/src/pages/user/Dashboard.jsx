import { Button } from "@/components/ui/button";
import { useLogoutMutation } from "@/features/auth/authApi";
import React from "react";
import { useDispatch } from "react-redux";

const Dashboard = () => {
  const dispatch = useDispatch();

  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();

      dispatch(clearCredentials());

      navigate("/auth/login", { replace: true });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Button onClick={handleLogout}>asdas</Button>
    </div>
  );
};

export default Dashboard;
