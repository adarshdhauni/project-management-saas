import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "@/features/auth/authApi";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/spinner";
import PasswordRequirements from "@/features/auth/components/PasswordRequirements";
import PasswordStrength from "@/features/auth/components/PasswordStrength";
import { getPasswordValidation } from "@/validations/passwordValidation";
import focusField from "@/utils/focusField";
import PageTransition from "@/components/shared/PageTransition";

const Register = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [registerUser, { isLoading: isRegistering }] =
    useRegisterUserMutation();

  const { passwordRules, passwordStrength } = getPasswordValidation(
    userData.password,
  );

  const handleChange = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const isEmailValid = /\S+@\S+\.\S+/.test(userData.email);

  const isPasswordMatch =
    userData.password && userData.password === userData.confirmPassword;

  const validateForm = () => {
    const { name, email, password, confirmPassword } = userData;

    const trimmedName = name.trim();

    if (!trimmedName) {
      focusField("name");
      return "Enter your name";
    }

    if (trimmedName.length < 2) {
      focusField("name");
      return "Name must be at least 2 characters";
    }

    if (trimmedName.length > 50) {
      focusField("name");
      return "Name cannot exceed 50 characters";
    }

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

    if (!confirmPassword.trim()) {
      focusField("confirmPassword");
      return "Confirm your password";
    }

    if (password !== confirmPassword) {
      focusField("confirmPassword");
      return "Passwords do not match";
    }

    if (password.length < 8) {
      focusField("password");
      return "Password must be at least 8 characters";
    }

    if (password.length > 64) {
      focusField("password");
      return "Password cannot exceed 64 characters";
    }

    if (!/[A-Z]/.test(password)) {
      focusField("password");
      return "Add at least 1 uppercase letter";
    }

    if (!/[a-z]/.test(password)) {
      focusField("password");
      return "Add at least 1 lowercase letter";
    }

    if (!/\d/.test(password)) {
      focusField("password");
      return "Add at least 1 number";
    }

    if (!/[^A-Za-z\d]/.test(password)) {
      focusField("password");
      return "Add at least 1 special character";
    }

    return null;
  };

  const handleRegister = async (e) => {
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
      await registerUser({
        name: userData.name,
        email: userData.email,
        password: userData.password,
      }).unwrap();

      toast.add({
        type: "success",
        title: "Account created successfully 🎉",
      });

      setUserData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      navigate("/dashboard", { replace: true });
    } catch (err) {
      toast.add({
        type: "error",
        title: err?.data?.message || "Signup failed",
        priority: "high",
      });
    }
  };

  return (
    <PageTransition className="space-y-12">
      <div className="space-y-3 text-center">
        <h1 className="text-2xl font-light tracking-wide sm:text-3xl">
          Create Account
        </h1>

        <p className="text-sm text-muted-foreground">
          Start your journey with us
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-10">
        <Field data-disabled={isRegistering}>
          <FieldLabel htmlFor="name">
            Name <span className="text-destructive">*</span>
          </FieldLabel>

          <Input
            id="name"
            type="text"
            placeholder="Enter your name"
            autoComplete="name"
            value={userData.name}
            onChange={handleChange}
            disabled={isRegistering}
            required
          />

          <FieldDescription>
            Enter your name as you'd like it displayed.
          </FieldDescription>
        </Field>

        <Field
          data-disabled={isRegistering}
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
            disabled={isRegistering}
            aria-invalid={!isEmailValid && userData.email.trim() !== ""}
            required
          />

          {userData.email.trim() !== "" && !isEmailValid && (
            <p className="text-xs text-destructive">Invalid email</p>
          )}

          <FieldDescription>
            We'll use this email to manage your account.
          </FieldDescription>
        </Field>

        <div className="space-y-6">
          <Field data-disabled={isRegistering}>
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
                disabled={isRegistering}
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

            <FieldDescription>
              Choose a unique password for your account.
            </FieldDescription>
          </Field>

          <PasswordRequirements passwordRules={passwordRules} />

          <PasswordStrength
            password={userData.password}
            passwordStrength={passwordStrength}
          />
        </div>

        <Field
          data-disabled={isRegistering}
          data-invalid={
            userData.confirmPassword.trim() !== "" && !isPasswordMatch
          }
        >
          <FieldLabel htmlFor="confirmPassword">
            Confirm Password <span className="text-destructive">*</span>
          </FieldLabel>

          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter your password"
              value={userData.confirmPassword}
              onChange={handleChange}
              disabled={isRegistering}
              aria-invalid={
                userData.confirmPassword.trim() !== "" && !isPasswordMatch
              }
              required
            />

            <button
              type="button"
              onClick={() => setShowConfirm((p) => !p)}
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors duration-150 hover:text-foreground"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {userData.confirmPassword.trim() !== "" && !isPasswordMatch && (
            <p className="text-xs text-destructive">Passwords do not match</p>
          )}

          <FieldDescription>
            Re-enter your password to confirm.
          </FieldDescription>
        </Field>

        <div className="space-y-4 pt-4">
          <Button
            size="lg"
            type="submit"
            disabled={isRegistering}
            className="w-full cursor-pointer"
          >
            {isRegistering ? (
              <>
                <Spinner data-icon="inline-start" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          <Button
            variant="secondary"
            size="lg"
            type="button"
            onClick={() => navigate("/")}
            className="w-full cursor-pointer"
          >
            Cancel
          </Button>
        </div>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Button
          onClick={() => navigate("/auth/login")}
          variant="link"
          className="cursor-pointer"
        >
          Sign in
        </Button>
      </p>
    </PageTransition>
  );
};

export default Register;
