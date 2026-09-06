import { Button } from "@/components/ui/button";
import { useLogoutMutation } from "@/features/auth/authApi";
import { clearCredentials } from "@/features/auth/authSlice";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
