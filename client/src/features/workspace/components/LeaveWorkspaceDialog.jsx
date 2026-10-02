import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

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

import { useLeaveWorkspaceMutation } from "../workspaceApi";

const LeaveWorkspaceDialog = ({
  isLeaveDialogOpen,
  setIsLeaveDialogOpen,
  workspace,
}) => {
  const navigate = useNavigate();

  const [leaveWorkspace, { isLoading: isLeaving }] =
    useLeaveWorkspaceMutation();

  const handleLeaveWorkspace = async () => {
    if (!workspace?._id) return;

    try {
      await leaveWorkspace(workspace._id).unwrap();

      toast.add({
        type: "success",
        title: "Workspace left",
        description: `You left "${workspace.name}" successfully.`,
      });

      setIsLeaveDialogOpen(false);

      navigate("/dashboard");
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
    <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Leave workspace?</DialogTitle>

          <DialogDescription>
            You will lose access to{" "}
            <span className="font-medium text-foreground">
              {workspace?.name}
            </span>{" "}
            and all of its projects, tasks, members, comments, and other
            workspace data. You can only rejoin if another member invites you
            again.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsLeaveDialogOpen(false)}
            disabled={isLeaving}
            className="cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleLeaveWorkspace}
            disabled={isLeaving || !workspace}
            className="cursor-pointer"
          >
            {isLeaving ? (
              <>
                <Spinner data-icon="inline-start" />
                Leaving...
              </>
            ) : (
              <>
                <LogOut data-icon="inline-start" />
                Leave workspace
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveWorkspaceDialog;
