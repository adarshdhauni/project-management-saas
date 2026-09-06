import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "@/features/auth/authApi";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/spinner";
import focusField from "@/utils/focusField";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/features/auth/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [loginUser, { isLoading: isSigningIn }] = useLoginUserMutation();

  const handleChange = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const isEmailValid = /\S+@\S+\.\S+/.test(userData.email);

  const validateForm = () => {
    const { email, password } = userData;

    if (!email.trim()) {
      focusField("email");
      return "Enter your email";
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      focusField("email");
      return "Invalid email format";
    }

    if (!password.trim()) {
      focusField("password");
      return "Enter your password";
    }

    return null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const error = validateForm();

    if (error) {
      toast.add({
        type: "error",
        description: error,
        priority: "high",
      });
      return;
    }

    try {
      const res = await loginUser(userData).unwrap();

      dispatch(setCredentials(res.data.user));

      toast.add({
        type: "success",
        title: "Logged in successfully 🎉",
      });

      setUserData({
        email: "",
        password: "",
      });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.add({
        type: "error",
        title: err?.data?.message || "Login failed",
        priority: "high",
      });
    }
  };

  return (
    <div className="space-y-12">
      <div className="space-y-3 text-center">
        <h1 className="text-2xl font-light tracking-wide sm:text-3xl">
          Sign In
        </h1>

        <p className="text-sm text-muted-foreground">Welcome back</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-10">
        <Field
          data-disabled={isSigningIn}
          data-invalid={!isEmailValid && userData.email.trim() !== ""}
        >
          <FieldLabel htmlFor="email">
            Email <span className="text-destructive">*</span>
          </FieldLabel>

          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            value={userData.email}
            onChange={handleChange}
            disabled={isSigningIn}
            aria-invalid={!isEmailValid && userData.email.trim() !== ""}
            required
          />

          {userData.email.trim() !== "" && !isEmailValid && (
            <p className="text-xs text-destructive">Invalid email</p>
          )}

          <FieldDescription>
            Enter the email associated with your account.
          </FieldDescription>
        </Field>

        <div className="space-y-6">
          <Field data-disabled={isSigningIn}>
            <FieldLabel htmlFor="password">
              Password <span className="text-destructive">*</span>
            </FieldLabel>

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={userData.password}
                onChange={handleChange}
                disabled={isSigningIn}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors duration-150 hover:text-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <FieldDescription>Enter your account password.</FieldDescription>

              <Button
                type="button"
                variant="link"
                onClick={() => navigate("/auth/forgot-password")}
                className="h-auto cursor-pointer p-0 text-sm"
              >
                Forgot password?
              </Button>
            </div>
          </Field>
        </div>

        <div className="space-y-4 pt-4">
          <Button
            type="submit"
            disabled={isSigningIn}
            className="w-full cursor-pointer"
          >
            {isSigningIn ? (
              <>
                <Spinner data-icon="inline-start" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>

          <Button
            variant="secondary"
            type="button"
            onClick={() => navigate("/")}
            className="w-full cursor-pointer"
          >
            Cancel
          </Button>
        </div>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Button
          onClick={() => navigate("/auth/register")}
          variant="link"
          className="cursor-pointer"
        >
          Sign up
        </Button>
      </p>
    </div>
  );
};

export default Login;
