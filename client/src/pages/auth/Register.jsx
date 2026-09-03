import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "@/redux/api/authApi";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/spinner";

const focusField = (id) => {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "center" });
  el?.focus();
};

const Register = () => {
  const navigate = useNavigate();

  const [registerUser, { isLoading: isRegistering }] =
    useRegisterUserMutation();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const passwordRules = {
    length: userData.password.length >= 8 && userData.password.length <= 64,
    upper: /[A-Z]/.test(userData.password),
    lower: /[a-z]/.test(userData.password),
    number: /\d/.test(userData.password),
    special: /[@$!%*?&]/.test(userData.password),
  };

  const getPasswordStrength = () => {
    const passed = Object.values(passwordRules).filter(Boolean).length;

    if (passed <= 2) return "weak";

    if (passed <= 4) return "medium";

    return "strong";
  };

  const passwordStrength = getPasswordStrength();

  const isEmailValid = /\S+@\S+\.\S+/.test(userData.email);

  const isPasswordMatch =
    userData.password && userData.password === userData.confirmPassword;

  const validateForm = () => {
    const { name, email, password, confirmPassword } = userData;

    if (!name.trim()) {
      focusField("name");
      return "Enter your name";
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      focusField("email");
      return "Invalid email format";
    }

    if (!email.trim()) {
      focusField("email");
      return "Enter your email";
    }

    if (!password.trim()) {
      focusField("password");
      return "Enter your password";
    }

    if (password !== confirmPassword) {
      focusField("confirmPassword");
      return "Passwords do not match";
    }

    if (!confirmPassword.trim()) {
      focusField("confirmPassword");
      return "Confirm your password";
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

    if (!/[@$!%*?&]/.test(password)) {
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
    } catch (err) {
      toast.add({
        type: "error",
        title: err?.data?.message || "Signup failed",
      });
    }
  };

  return (
    <div className="space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-2xl sm:text-3xl font-light tracking-wide">
          Create Account
        </h1>
        <p className="text-sm text-gray-500">Start your journey with us</p>
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
            Choose a unique username for your account.
          </FieldDescription>
        </Field>

        <Field
          data-disabled={isRegistering}
          data-invalid={!isEmailValid && userData.email}
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
            aria-invalid={!isEmailValid && userData.email.length > 1}
            required
          />

          {userData.email && !isEmailValid && (
            <p className="text-xs text-red-500">Invalid email</p>
          )}
          <FieldDescription>
            We&apos;ll send updates to this address.
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
                className="absolute right-2 top-1/2
  -translate-y-1/2
  text-black/50
  transition-colors duration-150
  hover:text-black
  cursor-pointer
"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <FieldDescription>
              Choose a unique password for your account.
            </FieldDescription>
          </Field>

          <div className="text-xs text-black/45 space-y-1.5">
            <p
              className={
                userData.password.length >= 8
                  ? "text-black/80"
                  : "text-black/40"
              }
            >
              • At least 8 characters
            </p>

            <p
              className={
                passwordRules.upper ? "text-black/80" : "text-black/40"
              }
            >
              • One uppercase letter
            </p>

            <p
              className={
                passwordRules.number ? "text-black/80" : "text-black/40"
              }
            >
              • One number
            </p>

            <p
              className={
                passwordRules.special ? "text-black/80" : "text-black/40"
              }
            >
              • One special character
            </p>
          </div>

          {userData.password && (
            <div className="flex gap-1 mt-3">
              {["weak", "medium", "strong"].map((_level, i) => (
                <div
                  key={i}
                  className={`h-0.5 flex-1 transition-all duration-300 ${
                    passwordStrength === "strong"
                      ? "bg-black"
                      : passwordStrength === "medium" && i < 2
                        ? "bg-black/70"
                        : passwordStrength === "weak" && i === 0
                          ? "bg-black/50"
                          : "bg-black/10"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <Field
          data-disabled={isRegistering}
          data-invalid={userData.confirmPassword && !isPasswordMatch}
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
              aria-invalid={userData.confirmPassword && !isPasswordMatch}
              required
            />

            <button
              type="button"
              onClick={() => setShowConfirm((p) => !p)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-black/50 transition-colors duration-150 hover:text-black cursor-pointer"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {userData.confirmPassword && !isPasswordMatch && (
            <p className="text-xs text-red-500">Passwords do not match</p>
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
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          <Button
            variant="secondary"
            size="lg"
            type="button"
            onClick={() => navigate(-1)}
            className="w-full cursor-pointer"
          >
            Cancel
          </Button>
        </div>
      </form>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Button
          onClick={() => navigate("/auth/login")}
          variant="ghost"
          className="cursor-pointer"
        >
          Sign in
        </Button>
      </p>
    </div>
  );
};

export default Register;
