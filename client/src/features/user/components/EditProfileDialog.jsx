import { Save } from "lucide-react";
import { useEffect, useState } from "react";

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
import { useUpdateUserMutation } from "@/features/user/userApi";
import focusField from "@/utils/focusField";

const EditProfileDialog = ({ open, onOpenChange, user }) => {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const [updateUser, { isLoading, error }] = useUpdateUserMutation();

  console.log(error)

  useEffect(() => {
    if (open) {
      setName(user?.name || "");
      setEmail(user?.email || "");
    }
  }, [open, user]);

  const trimmedName = name.trim();
  const trimmedEmail = email.trim();

  const nameError =
    trimmedName.length < 2
      ? "Name must be at least 2 characters."
      : trimmedName.length > 50
        ? "Name cannot exceed 50 characters."
        : "";

  const emailError = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)
    ? "Enter a valid email address."
    : "";

  const validateForm = () => {
    if (trimmedName.length < 2 || trimmedName.length > 50) {
      focusField("profile-name");
      return nameError;
    }

    if (emailError) {
      focusField("profile-email");
      return emailError;
    }

    if (
      trimmedName === user?.name &&
      trimmedEmail.toLowerCase() === user?.email?.toLowerCase()
    ) {
      return "No changes to save.";
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
      await updateUser({
        name: trimmedName,
        email: trimmedEmail,
      }).unwrap();

      toast.add({
        type: "success",
        title: "Profile updated successfully.",
      });

      onOpenChange(false);
    } catch (error) {
      toast.add({
        type: "error",
        title: error?.data?.message || "Unable to update profile.",
        priority: "high",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>

            <DialogDescription>
              Update your name and email address associated with your account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <Field
              data-disabled={isLoading}
              data-invalid={nameError !== "" && trimmedName !== ""}
            >
              <FieldLabel htmlFor="profile-name">
                Full name <span className="text-destructive">*</span>
              </FieldLabel>

              <Input
                id="profile-name"
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                aria-invalid={nameError !== "" && trimmedName !== ""}
                maxLength={50}
                required
              />

              {trimmedName !== "" && nameError && (
                <p className="text-xs text-destructive">{nameError}</p>
              )}

              <FieldDescription>
                Your name must be between 2 and 50 characters.
              </FieldDescription>
            </Field>

            <Field
              data-disabled={isLoading}
              data-invalid={emailError !== "" && trimmedEmail !== ""}
            >
              <FieldLabel htmlFor="profile-email">
                Email address <span className="text-destructive">*</span>
              </FieldLabel>

              <Input
                id="profile-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                aria-invalid={emailError !== "" && trimmedEmail !== ""}
                required
              />

              {trimmedEmail !== "" && emailError && (
                <p className="text-xs text-destructive">{emailError}</p>
              )}

              <FieldDescription>
                Use an email address you can access.
              </FieldDescription>
            </Field>
          </div>

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
              disabled={
                isLoading ||
                !trimmedName ||
                !trimmedEmail ||
                Boolean(nameError) ||
                Boolean(emailError)
              }
              className="cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Saving...
                </>
              ) : (
                <>
                  <Save data-icon="inline-start" />
                  Save changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
