import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useChangePasswordMutation } from "@/features/user/userApi";
import focusField from "@/utils/focusField";
import { getPasswordValidation } from "@/validations/passwordValidation";
import PasswordStrength from "@/features/auth/components/PasswordStrength";
import PasswordRequirements from "@/features/auth/components/PasswordRequirements";

const ChangePasswordDialog = ({ open, onOpenChange }) => {
  const [userData, setUserData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const { passwordRules, passwordStrength } = getPasswordValidation(
    userData.newPassword,
  );

  const isPasswordMatch =
    userData.newPassword.length > 0 &&
    userData.newPassword === userData.confirmPassword;

  const validateForm = () => {
    const { oldPassword, newPassword, confirmPassword } = userData;

    if (!oldPassword) {
      focusField("oldPassword");
      return "Enter your current password.";
    }

    if (!newPassword) {
      focusField("newPassword");
      return "Enter your new password.";
    }

    if (!confirmPassword) {
      focusField("confirmPassword");
      return "Confirm your new password.";
    }

    const { passwordRules } = getPasswordValidation(newPassword);

    if (!passwordRules.length) {
      focusField("newPassword");
      return "Password must be between 8 and 64 characters.";
    }

    if (!passwordRules.upper) {
      focusField("newPassword");
      return "Add at least 1 uppercase letter.";
    }

    if (!passwordRules.lower) {
      focusField("newPassword");
      return "Add at least 1 lowercase letter.";
    }

    if (!passwordRules.number) {
      focusField("newPassword");
      return "Add at least 1 number.";
    }

    if (!passwordRules.special) {
      focusField("newPassword");
      return "Add at least 1 special character.";
    }

    if (newPassword !== confirmPassword) {
      focusField("confirmPassword");
      return "Passwords do not match.";
    }

    if (newPassword === oldPassword) {
      focusField("newPassword");
      return "New password must be different from your current password.";
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
      await changePassword({
        oldPassword: userData.oldPassword,
        newPassword: userData.newPassword,
      }).unwrap();

      toast.add({
        type: "success",
        title: "Password updated successfully.",
      });

      setUserData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setShowOldPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      toast.add({
        type: "error",
        title: error?.data?.message || "Unable to update password.",
        priority: "high",
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isLoading) {
          onOpenChange(nextOpen);
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
            <DialogDescription>
              Update your password to keep your account secure.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <Field data-disabled={isLoading}>
              <FieldLabel htmlFor="oldPassword">
                Old password <span className="text-destructive">*</span>
              </FieldLabel>

              <div className="relative">
                <Input
                  id="oldPassword"
                  type={showOldPassword ? "text" : "password"}
                  placeholder="Enter your old password"
                  value={userData.oldPassword}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      [e.target.id]: e.target.value,
                    }))
                  }
                  disabled={isLoading}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowOldPassword((p) => !p)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors duration-150 hover:text-foreground"
                >
                  {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <FieldDescription>Enter your old password.</FieldDescription>
            </Field>

            <Field data-disabled={isLoading}>
              <FieldLabel htmlFor="newPassword">
                New password <span className="text-destructive">*</span>
              </FieldLabel>

              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={userData.newPassword}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      [e.target.id]: e.target.value,
                    }))
                  }
                  disabled={isLoading}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowNewPassword((p) => !p)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors duration-150 hover:text-foreground"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <FieldDescription>Enter your new password.</FieldDescription>
            </Field>

            <PasswordRequirements passwordRules={passwordRules} />

            <PasswordStrength
              password={userData.newPassword}
              passwordStrength={passwordStrength}
            />
          </div>

          <Field
            data-disabled={isLoading}
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
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={userData.confirmPassword}
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    [e.target.id]: e.target.value,
                  }))
                }
                disabled={isLoading}
                aria-invalid={
                  userData.confirmPassword.trim() !== "" && !isPasswordMatch
                }
                required
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((p) => !p)}
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors duration-150 hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {userData.confirmPassword.trim() !== "" && !isPasswordMatch && (
              <p className="text-xs text-destructive">Passwords do not match</p>
            )}

            <FieldDescription>
              Re-enter your password to confirm.
            </FieldDescription>
          </Field>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Updating...
                </>
              ) : (
                <>
                  <LockKeyhole data-icon="inline-start" />
                  Update password
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordDialog;
