import { Archive } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";

import { useArchiveProjectMutation } from "@/features/project/projectApi";

const ArchiveDialog = ({
  isArchiveDialogOpen,
  setIsArchiveDialogOpen,
  selectedProject,
}) => {
  const [archiveProject, { isLoading: isArchiving }] =
    useArchiveProjectMutation();

  const handleArchiveProject = async () => {
    if (!selectedProject?._id) return;

    try {
      await archiveProject(selectedProject._id).unwrap();

      toast.add({
        type: "success",
        title: "Project archived",
        description: `"${selectedProject.name}" was archived successfully.`,
      });

      setIsArchiveDialogOpen(false);
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
    <Dialog open={isArchiveDialogOpen} onOpenChange={setIsArchiveDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Archive project?</DialogTitle>

          <DialogDescription>
            This will archive{" "}
            <span className="font-medium text-foreground">
              {selectedProject?.name}
            </span>
            . The project will be removed from your active projects, but its
            tasks, comments, and activity history will be preserved. You can
            restore it anytime.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsArchiveDialogOpen(false)}
            disabled={isArchiving}
            className="cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleArchiveProject}
            disabled={isArchiving || !selectedProject}
            className="cursor-pointer"
          >
            {isArchiving ? (
              <>
                <Spinner data-icon="inline-start" />
                Archiving...
              </>
            ) : (
              <>
                <Archive data-icon="inline-start" />
                Archive project
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ArchiveDialog;
