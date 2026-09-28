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

import { useDeleteProjectMutation } from "../projectApi";
import { Trash2 } from "lucide-react";

const DeleteDialog = ({
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  selectedProject,
}) => {
  const [deleteProject, { isLoading: isDeleting, error }] = useDeleteProjectMutation(
    selectedProject?._id,
  );

  console.log(error)

  console.log(selectedProject?._id)

  const handleDeleteProject = async () => {
    if (!selectedProject?._id) return;

    try {
      await deleteProject({
        workspaceId: selectedProject.workspace,
        projectId: selectedProject._id,
      }).unwrap();

      toast.add({
        type: "success",
        title: "Project deleted",
        description: `"${selectedProject.name}" was deleted successfully.`,
      });

      setIsDeleteDialogOpen(false);
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
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete project?</DialogTitle>

          <DialogDescription>
            This will permanently delete{" "}
            <span className="font-medium text-foreground">
              {selectedProject?.name}
            </span>{" "}
            and all of its associated tasks and data. This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsDeleteDialogOpen(false)}
            disabled={isDeleting}
            className="cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleDeleteProject}
            disabled={isDeleting || !selectedProject}
            className="cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Spinner data-icon="inline-start" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 data-icon="inline-start" />
                Delete project
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;
