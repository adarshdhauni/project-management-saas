import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "@/features/task/taskApi";

import { useGetWorkspaceMembersQuery } from "@/features/workspace/workspaceApi";

const EMPTY_FORM = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  assignee: "",
  dueDate: "",
};

const TaskDialog = ({
  open,
  onOpenChange,
  projectId,
  workspaceId,
  task = null,
}) => {
  const isEditing = Boolean(task);

  const [form, setForm] = useState(EMPTY_FORM);
  const [validationError, setValidationError] = useState("");

  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const { data: membersData, isLoading: isMembersLoading } =
    useGetWorkspaceMembersQuery(
      {
        workspaceId,
        page: 1,
        limit: 100,
      },
      {
        skip: !open || !workspaceId,
      },
    );

  const members = membersData?.data?.members ?? [];

  const isSubmitting = isCreating || isUpdating;

  useEffect(() => {
    if (!open) return;

    if (task) {
      setForm({
        title: task.title ?? "",
        description: task.description ?? "",
        status: task.status ?? "todo",
        priority: task.priority ?? "medium",
        assignee: task.assignee?._id ?? task.assignee ?? "",
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().slice(0, 10)
          : "",
      });
    } else {
      setForm(EMPTY_FORM);
    }

    setValidationError("");
  }, [open, task]);

  const handleChange = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (validationError) {
      setValidationError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const title = form.title.trim();

    if (title.length < 3) {
      setValidationError("Task title must be at least 3 characters.");
      return;
    }

    const payload = {
      title,
      description: form.description.trim() || undefined,
      status: form.status,
      priority: form.priority,
      assignee: form.assignee || null,
      dueDate: form.dueDate || null,
    };

    try {
      if (isEditing) {
        await updateTask({
          taskId: task._id,
          data: payload,
        }).unwrap();
      } else {
        await createTask({
          projectId,
          data: payload,
        }).unwrap();
      }

      onOpenChange(false);
    } catch (error) {
      setValidationError(
        error?.data?.message ||
          `Failed to ${isEditing ? "update" : "create"} task.`,
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit task" : "Create task"}</DialogTitle>

          <DialogDescription>
            {isEditing
              ? "Update the task details."
              : "Create a new task for this project."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="task-title">Title</Label>

            <Input
              id="task-title"
              value={form.title}
              onChange={(event) => handleChange("title", event.target.value)}
              placeholder="Implement authentication"
              maxLength={200}
              disabled={isSubmitting}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description">Description</Label>

            <Textarea
              id="task-description"
              value={form.description}
              onChange={(event) =>
                handleChange("description", event.target.value)
              }
              placeholder="Describe what needs to be done..."
              maxLength={5000}
              rows={5}
              disabled={isSubmitting}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Status</Label>

              <Select
                value={form.status}
                onValueChange={(value) => handleChange("status", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="todo">To do</SelectItem>
                  <SelectItem value="in_progress">In progress</SelectItem>
                  <SelectItem value="in_review">In review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>

              <Select
                value={form.priority}
                onValueChange={(value) => handleChange("priority", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Assignee</Label>

            <Select
              value={form.assignee || "unassigned"}
              onValueChange={(value) =>
                handleChange("assignee", value === "unassigned" ? "" : value)
              }
              disabled={isSubmitting || isMembersLoading}
            >
              <SelectTrigger className="w-full cursor-pointer">
                <SelectValue
                  placeholder={
                    isMembersLoading ? "Loading members..." : "Select assignee"
                  }
                />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>

                {members.map((member) => (
                  <SelectItem
                    key={member._id}
                    value={member.user?._id ?? member.user}
                  >
                    {member.user?.name ?? member.user?.email ?? "Member"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-due-date">Due date</Label>

            <Input
              id="task-due-date"
              type="date"
              value={form.dueDate}
              onChange={(event) => handleChange("dueDate", event.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {validationError && (
            <p className="text-sm text-destructive">{validationError}</p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}

              {isEditing ? "Save changes" : "Create task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
