import { useEffect, useState } from "react";

import { Pencil } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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

import { useUpdateMemberRoleMutation } from "@/features/workspace/workspaceApi";

const UpdateMemberRoleDialog = ({
  open,
  onOpenChange,
  workspaceId,
  member,
}) => {
  const [role, setRole] = useState("member");

  const [updateMemberRole, { isLoading }] = useUpdateMemberRoleMutation();

  useEffect(() => {
    if (!open) {
      setRole("member");
      return;
    }

    setRole(member?.role ?? "member");
  }, [open, member]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!member?._id || !workspaceId) {
      return;
    }

    if (role === member.role) {
      toast.add({
        type: "error",
        description: "Select a different role.",
        priority: "high",
      });

      return;
    }

    try {
      console.log("role:", role);
      console.log("payload:", { role });

      await updateMemberRole({
        workspaceId,
        memberId: member._id,
        role,
      }).unwrap();

      toast.add({
        type: "success",
        title: "Member role updated successfully",
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
            <DialogTitle>Change member role</DialogTitle>

            <DialogDescription>
              Update the role for {member?.user?.name ?? "this member"}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <Field data-disabled={isLoading}>
              <FieldLabel>
                Role <span className="text-destructive">*</span>
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
                Choose the role this member should have in the workspace.
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
              disabled={isLoading || role === member?.role}
              className="cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Updating...
                </>
              ) : (
                <>
                  <Pencil data-icon="inline-start" />
                  Update role
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateMemberRoleDialog;
