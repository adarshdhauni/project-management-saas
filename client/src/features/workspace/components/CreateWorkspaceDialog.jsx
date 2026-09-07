import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { toast } from "@/components/ui/toast";

import { useCreateWorkspaceMutation } from "@/features/workspace/workspaceApi";
import focusField from "@/utils/focusField";

const CreateWorkspaceDialog = ({ open, onOpenChange }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [createWorkspace, { isLoading }] = useCreateWorkspaceMutation();

  useEffect(() => {
    if (!open) {
      setName("");
      setDescription("");
    }
  }, [open]);

  const validateForm = () => {
    if (!name.trim()) {
      focusField("workspace-name");
      return "Enter your workspace name";
    }

    if (name.length < 3) {
      focusField("workspace-name");
      return "Workspace name must be at least 3 characters";
    }

    if (name.length > 100) {
      focusField("workspace-name");
      return "Workspace name cannot exceed 100 characters";
    }

    if (description.length > 500) {
      focusField("workspace-description");
      return "Description cannot exceed 500 characters";
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

    const workspaceData = {
      name: name,
      description: description,
    };

    try {
      await createWorkspace(workspaceData).unwrap();

      toast.add({
        type: "success",
        title: "Workspace created successfully 🎉",
      });

      onOpenChange(false);
    } catch (error) {
      toast.add({
        type: "error",
        title: err?.data?.message || "Something went wrong",
        priority: "high",
      });
    }
  };

  const nameValid = name.length >= 3 && name.length <= 100;
  const descriptionValid = description.length <= 500;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Create workspace</DialogTitle>

            <DialogDescription>
              Create a workspace to organize your projects, tasks, and team
              members.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <Field
              data-disabled={isLoading}
              data-invalid={!nameValid && name.trim() !== ""}
            >
              <FieldLabel htmlFor="workspace-name">
                Workspace name <span className="text-destructive">*</span>
              </FieldLabel>

              <Input
                id="workspace-name"
                type="text"
                placeholder="e.g. TaskFlow"
                autoComplete="organization"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                aria-invalid={!nameValid && name.trim() !== ""}
                required
              />
              {name.trim() !== "" && !nameValid && (
                <p className="text-xs text-destructive">Invalid name</p>
              )}

              <FieldDescription>
                Choose a name for your workspace.
              </FieldDescription>
            </Field>

            <Field
              data-disabled={isLoading}
              data-invalid={!descriptionValid && description.trim() !== ""}
            >
              <FieldLabel htmlFor="workspace-description">
                Description{" "}
                <span className="text-muted-foreground">(optional)</span>
              </FieldLabel>

              <Textarea
                id="workspace-description"
                placeholder="What is this workspace for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
                className="resize-none"
                aria-invalid={!descriptionValid && description.trim() !== ""}
              />
              {description.trim() !== "" && !descriptionValid && (
                <p className="text-xs text-destructive">Invalid description</p>
              )}

              <FieldDescription>
                Add a short description to help identify your workspace.
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
              disabled={isLoading || !name.trim()}
              className="cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus data-icon="inline-start" />
                  Create workspace
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkspaceDialog;
