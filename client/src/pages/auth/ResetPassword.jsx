import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useResetPasswordMutation } from "@/redux/api/authApi";
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

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [resetPassword, { isLoading: isResetting }] =
    useResetPasswordMutation();

  const { passwordRules, passwordStrength } = getPasswordValidation(
    values.password,
  );

  const handleChange = (e) => {
    setValues((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const isPasswordMatch =
    values.password && values.password === values.confirmPassword;

  const validateForm = () => {
    const { password, confirmPassword } = values;

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

  const handleSubmit = async (e) => {
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
      await resetPassword({
        token,
        password: values.password.trim(),
      }).unwrap();

      toast.add({
        type: "success",
        title: "Password reset successful 🎉",
      });

      setValues({
        password: "",
        confirmPassword: "",
      });

      navigate("/auth/login", { replace: true });
    } catch (err) {
      toast.add({
        type: "error",
        title: err?.data?.message || "Password reset failed",
        priority: "high",
      });
    }
  };

  return (
    <PageTransition className="space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-2xl sm:text-3xl font-light tracking-wide">
          Reset Password
        </h1>
        <p className="text-sm text-gray-500">Enter your new password</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-6">
          <Field data-disabled={isResetting}>
            <FieldLabel htmlFor="password">
              Password <span className="text-destructive">*</span>
            </FieldLabel>

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your new password"
                value={values.password}
                onChange={handleChange}
                disabled={isResetting}
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
              Choose a strong password for your account.
            </FieldDescription>
          </Field>

          <PasswordRequirements passwordRules={passwordRules} />

          <PasswordStrength
            password={values.password}
            passwordStrength={passwordStrength}
          />
        </div>

        <Field
          data-disabled={isResetting}
          data-invalid={
            values.confirmPassword.trim() !== "" && !isPasswordMatch
          }
        >
          <FieldLabel htmlFor="confirmPassword">
            Confirm Password <span className="text-destructive">*</span>
          </FieldLabel>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter your new password"
              value={values.confirmPassword}
              onChange={handleChange}
              disabled={isResetting}
              aria-invalid={
                values.confirmPassword.trim() !== "" && !isPasswordMatch
              }
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

          {values.confirmPassword.trim() !== "" && !isPasswordMatch && (
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
            disabled={isResetting}
            className="w-full cursor-pointer"
          >
            {isResetting ? (
              <>
                <Spinner data-icon="inline-start" />
                Resetting...
              </>
            ) : (
              "Reset Password"
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
    </PageTransition>
  );
};

export default ResetPassword;
