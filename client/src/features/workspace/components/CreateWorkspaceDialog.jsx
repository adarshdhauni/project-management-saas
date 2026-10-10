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
import { useNavigate } from "react-router-dom";

const CreateWorkspaceDialog = ({ open, onOpenChange }) => {
  const navigate = useNavigate();

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
      const response = await createWorkspace(workspaceData).unwrap();

      toast.add({
        type: "success",
        title: "Workspace created successfully 🎉",
      });

      const newWorkspaceId = response.data._id;

      onOpenChange(false);

      navigate(`/dashboard/workspaces/${newWorkspaceId}`);
    } catch (error) {
      toast.add({
        type: "error",
        title: error?.data?.message || "Something went wrong",
        priority: "high",
      });
    }
  };

  const trimmedName = name.trim();

  const nameValid = trimmedName.length >= 3 && trimmedName.length <= 100;

  const nameError =
    trimmedName.length < 3
      ? "Workspace name must be at least 3 characters."
      : trimmedName.length > 100
        ? "Workspace name cannot exceed 100 characters."
        : "";

  const descriptionError =
    description.length > 500 ? "Description cannot exceed 500 characters." : "";

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
              data-invalid={nameError !== "" && trimmedName !== ""}
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
                aria-invalid={nameError !== "" && trimmedName !== ""}
                maxLength={100}
                required
              />

              {trimmedName !== "" && nameError && (
                <p className="text-xs text-destructive">{nameError}</p>
              )}

              <FieldDescription>
                Use a name between 3 and 100 characters.
              </FieldDescription>
            </Field>
            <Field
              data-disabled={isLoading}
              data-invalid={descriptionError !== ""}
            >
              <FieldLabel htmlFor="workspace-description">
                Description
              </FieldLabel>

              <Textarea
                id="workspace-description"
                placeholder="What is this workspace for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
                aria-invalid={descriptionError !== ""}
                maxLength={500}
              />

              {descriptionError && (
                <p className="text-xs text-destructive">{descriptionError}</p>
              )}

              <FieldDescription>
                Briefly describe your workspace (up to 500 characters).
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
              disabled={isLoading || !nameValid}
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
