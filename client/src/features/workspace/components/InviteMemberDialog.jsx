import { useEffect, useState } from "react";

import { UserPlus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useInviteWorkspaceMemberMutation } from "@/features/workspace/workspaceApi";

const InviteMemberDialog = ({ open, onOpenChange, workspaceId }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");

  const [inviteMember, { isLoading }] = useInviteWorkspaceMemberMutation();

  useEffect(() => {
    if (!open) {
      setEmail("");
      setRole("member");
      return;
    }

    setEmail("");
    setRole("member");
  }, [open]);

  const isEmailValid = /\S+@\S+\.\S+/.test(email);

  const validateForm = () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      document.getElementById("invite-email")?.focus();
      return "Enter the member's email address";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      document.getElementById("invite-email")?.focus();
      return "Enter a valid email address";
    }

    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const error = validateForm();

    if (error) {
      toast.add({
        type: "error",
        description: error,
        priority: "high",
      });

      return;
    }

    const inviteData = {
      email: email.trim().toLowerCase(),
      role,
    };

    try {
      await inviteMember({
        workspaceId,
        data: inviteData,
      }).unwrap();

      toast.add({
        type: "success",
        title: "Invitation sent successfully",
      });

      onOpenChange(false);
    } catch (error) {
      console.log(error);

      toast.add({
        type: "error",
        title: error?.data?.message || "Something went wrong",
        priority: "high",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Invite member</DialogTitle>

            <DialogDescription>
              Send an invitation to join this workspace.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <Field
              data-disabled={isLoading}
              data-invalid={!isEmailValid && email.trim() !== ""}
            >
              <FieldLabel htmlFor="invite-email">
                Email <span className="text-destructive">*</span>
              </FieldLabel>

              <Input
                id="invite-email"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={isLoading}
                aria-invalid={!isEmailValid && email.trim() !== ""}
                required
              />

              {email.trim() !== "" && !isEmailValid && (
                <p className="text-xs text-destructive">Invalid email</p>
              )}

              <FieldDescription>
                Enter the email address of the person you want to invite.
              </FieldDescription>
            </Field>

            <Field data-disabled={isLoading}>
              <FieldLabel>
                Role <span className="text-muted-foreground">(optional)</span>
              </FieldLabel>

              <Select value={role} onValueChange={setRole} disabled={isLoading}>
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue>
                    {role === "admin" ? "Admin" : "Member"}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="member" className="cursor-pointer">
                    Member
                  </SelectItem>

                  <SelectItem value="admin" className="cursor-pointer">
                    Admin
                  </SelectItem>
                </SelectContent>
              </Select>

              <FieldDescription>
                Choose the role this member will have in the workspace.
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
              disabled={isLoading || !email.trim()}
              className="cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Sending...
                </>
              ) : (
                <>
                  <UserPlus data-icon="inline-start" />
                  Send invitation
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMemberDialog;
