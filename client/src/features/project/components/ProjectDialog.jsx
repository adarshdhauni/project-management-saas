import { useEffect, useState } from "react";
import { Plus, Pencil } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";

import { projectColors, projectIcons } from "@/constants/projectOptions";

import focusField from "@/utils/focusField";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from "../projectApi";

const ProjectDialog = ({ open, onOpenChange, workspaceId, project = null }) => {
  const isEditMode = Boolean(project);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [icon, setIcon] = useState("");

  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();

  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();

  const isLoading = isCreating || isUpdating;

  useEffect(() => {
    if (!open) {
      setName("");
      setDescription("");
      setColor("");
      setIcon("");
      return;
    }

    if (project) {
      setName(project.name ?? "");
      setDescription(project.description ?? "");
      setColor(project.color ?? "");
      setIcon(project.icon ?? "");
    } else {
      setName("");
      setDescription("");
      setColor("");
      setIcon("");
    }
  }, [open, project]);

  const validateForm = () => {
    if (!name.trim()) {
      focusField("project-name");
      return "Enter your project name";
    }

    if (name.length < 3) {
      focusField("project-name");
      return "Project name must be at least 3 characters";
    }

    if (name.length > 100) {
      focusField("project-name");
      return "Project name cannot exceed 100 characters";
    }

    if (description.length > 500) {
      focusField("project-description");
      return "Project cannot exceed 500 characters";
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

    const projectData = {
      name: name.trim(),
      description: description.trim() || undefined,
      color:
        color === "none" ? (isEditMode ? null : undefined) : color || undefined,
      icon:
        icon === "none" ? (isEditMode ? null : undefined) : icon || undefined,
    };

    try {
      if (isEditMode) {
        await updateProject({
          id: project._id,
          data: projectData,
        }).unwrap();

        toast.add({
          type: "success",
          title: "Project updated successfully",
        });
      } else {
        await createProject({
          id: workspaceId,
          data: projectData,
        }).unwrap();

        toast.add({
          type: "success",
          title: "Project created successfully",
        });
      }

      onOpenChange(false);
    } catch (error) {
      console.log(error)
      toast.add({
        type: "error",
        title: error?.data?.message || "Something went wrong",
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
            <DialogTitle>
              {isEditMode ? "Edit project" : "Create project"}
            </DialogTitle>

            <DialogDescription>
              {isEditMode
                ? "Update your project details."
                : "Create a project to organize tasks and work within this workspace."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <Field
              data-disabled={isLoading}
              data-invalid={!nameValid && name.trim() !== ""}
            >
              <FieldLabel htmlFor="project-name">
                Project name <span className="text-destructive">*</span>
              </FieldLabel>

              <Input
                id="project-name"
                type="text"
                placeholder="e.g. Website Redesign"
                autoComplete="off"
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
                Choose a name for your project.
              </FieldDescription>
            </Field>

            <Field
              data-disabled={isLoading}
              data-invalid={!descriptionValid && description.trim() !== ""}
            >
              <FieldLabel htmlFor="project-description">
                Description{" "}
                <span className="text-muted-foreground">(optional)</span>
              </FieldLabel>

              <Textarea
                id="project-description"
                placeholder="What is this project about?"
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
                Add a short description to help identify your project.
              </FieldDescription>
            </Field>

            <Field data-disabled={isLoading}>
              <FieldLabel>
                Color
                <span className="text-muted-foreground">(optional)</span>{" "}
              </FieldLabel>
              <Select
                value={color}
                onValueChange={setColor}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue>
                    {(() => {
                      const selectedColor = projectColors.find(
                        (item) => item.value === color,
                      );

                      if (!selectedColor) {
                        return color === "none" ? "No color" : "Select a color";
                      }

                      return (
                        <div className="flex items-center gap-2">
                          <span
                            className={`size-3 rounded-full ${selectedColor.className}`}
                          />
                          <span>{selectedColor.label}</span>
                        </div>
                      );
                    })()}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="none" className="cursor-pointer">
                    No color
                  </SelectItem>

                  <SelectSeparator />

                  {projectColors.map((projectColor) => (
                    <SelectItem
                      key={projectColor.value}
                      value={projectColor.value}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`size-3 rounded-full ${projectColor.className}`}
                        />
                        <span>{projectColor.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>
                {" "}
                Choose a color to identify your project.{" "}
              </FieldDescription>
            </Field>

            <Field data-disabled={isLoading}>
              <FieldLabel>
                Icon <span className="text-muted-foreground">(optional)</span>
              </FieldLabel>

              <Select value={icon} onValueChange={setIcon} disabled={isLoading}>
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue>
                    {(() => {
                      const selectedIcon = projectIcons.find(
                        (item) => item.value === icon,
                      );

                      if (icon === "none") return "No icon";
                      if (!selectedIcon) return "Select an icon";

                      const Icon = selectedIcon.icon;

                      return (
                        <div className="flex items-center gap-2">
                          <Icon className="size-4" />
                          <span>{selectedIcon.label}</span>
                        </div>
                      );
                    })()}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="none" className="cursor-pointer">
                    No icon
                  </SelectItem>

                  <SelectSeparator />

                  {projectIcons.map((projectIcon) => {
                    const Icon = projectIcon.icon;

                    return (
                      <SelectItem
                        key={projectIcon.value}
                        value={projectIcon.value}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="size-4" />
                          <span>{projectIcon.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <FieldDescription>
                Choose an icon to identify your project.
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
                  {isEditMode ? "Saving..." : "Creating..."}
                </>
              ) : (
                <>
                  {isEditMode ? (
                    <Pencil data-icon="inline-start" />
                  ) : (
                    <Plus data-icon="inline-start" />
                  )}

                  {isEditMode ? "Save changes" : "Create project"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDialog;
