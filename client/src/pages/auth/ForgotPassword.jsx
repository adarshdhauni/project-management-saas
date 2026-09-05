import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "@/features/auth/authApi";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/spinner";
import focusField from "@/utils/focusField";
import PageTransition from "@/components/shared/PageTransition";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    email: "",
  });

  const [forgotPassword, { isLoading: isSending }] =
    useForgotPasswordMutation();

  const handleChange = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const isEmailValid = /\S+@\S+\.\S+/.test(userData.email);

  const validateForm = () => {
    const { email } = userData;

    if (!email.trim()) {
      focusField("email");
      return "Enter your email";
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      focusField("email");
      return "Invalid email format";
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
      await forgotPassword(userData).unwrap();

      toast.add({
        type: "success",
        title: "Reset link sent to your email 🎉",
      });

      setUserData({
        email: "",
      });
    } catch (err) {
      toast.add({
        type: "error",
        title: err?.data?.message || "Something went wrong",
        priority: "high",
      });
    }
  };

  return (
    <PageTransition className="space-y-12">
      <div className="space-y-3 text-center">
        <h1 className="text-2xl font-light tracking-wide sm:text-3xl">
          Forgot Your Password
        </h1>

        <p className="text-sm text-muted-foreground">
          We'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <Field
          data-disabled={isSending}
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
            disabled={isSending}
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

        <div className="space-y-4 pt-4">
          <Button
            size="lg"
            type="submit"
            disabled={isSending}
            className="w-full cursor-pointer"
          >
            {isSending ? (
              <>
                <Spinner data-icon="inline-start" />
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>

          <Button
            variant="secondary"
            size="lg"
            type="button"
            onClick={() => navigate("/auth/login")}
            className="w-full cursor-pointer"
          >
            Cancel
          </Button>
        </div>
      </form>
    </PageTransition>
  );
};

export default ForgotPassword;
