import React from "react";

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
import { Trash2 } from "lucide-react";

import { useRemoveWorkspaceMemberMutation } from "../workspaceApi";

const RemoveMemberDialog = ({
  isRemoveDialogOpen,
  setIsRemoveDialogOpen,
  selectedMember,
  workspaceId,
}) => {
  const [removeMember, { isLoading: isRemoving }] =
    useRemoveWorkspaceMemberMutation();

  const handleRemoveMember = async () => {
    if (!selectedMember?._id || !workspaceId) return;

    try {
      await removeMember({
        workspaceId,
        memberId: selectedMember._id,
      }).unwrap();

      toast.add({
        type: "success",
        title: "Member removed",
        description: `"${selectedMember.user?.name}" was removed from the workspace successfully.`,
      });

      setIsRemoveDialogOpen(false);
    } catch (error) {
      toast.add({
        type: "error",
        title:
          error?.data?.message || "Something went wrong. Please try again.",
        priority: "high",
      });
    }
  };

  return (
    <Dialog open={isRemoveDialogOpen} onOpenChange={setIsRemoveDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Remove member?</DialogTitle>

          <DialogDescription>
            This will remove{" "}
            <span className="font-medium text-foreground">
              {selectedMember?.user?.name}
            </span>{" "}
            from this workspace. They will lose access to the workspace and its
            data. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsRemoveDialogOpen(false)}
            disabled={isRemoving}
            className="cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleRemoveMember}
            disabled={isRemoving || !selectedMember}
            className="cursor-pointer"
          >
            {isRemoving ? (
              <>
                <Spinner data-icon="inline-start" />
                Removing...
              </>
            ) : (
              <>
                <Trash2 data-icon="inline-start" />
                Remove member
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RemoveMemberDialog;
