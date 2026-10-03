import { Link } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  GripVertical,
  UserRound,
} from "lucide-react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Badge } from "@/components/ui/badge";

const getStatusLabel = (status) => {
  const labels = {
    todo: "To do",
    in_progress: "In progress",
    in_review: "In review",
    done: "Done",
  };

  return labels[status] ?? status;
};

const getPriorityLabel = (priority) => {
  const labels = {
    low: "Low",
    medium: "Medium",
    high: "High",
    urgent: "Urgent",
  };

  return labels[priority] ?? priority;
};

const getStatusBadgeClass = (status) => {
  const classes = {
    todo: "bg-muted text-muted-foreground",
    in_progress: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    in_review: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    done: "bg-green-500/10 text-green-600 dark:text-green-400",
  };

  return classes[status] ?? "bg-muted text-muted-foreground";
};

const getPriorityBadgeClass = (priority) => {
  const classes = {
    low: "bg-muted text-muted-foreground",
    medium: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    high: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    urgent: "bg-red-500/10 text-red-600 dark:text-red-400",
  };

  return classes[priority] ?? "bg-muted text-muted-foreground";
};

const formatDueDate = (date) => {
  if (!date) return "No due date";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

const SortableTaskRow = ({
  task,
  workspaceId,
  projectId,
  isDraggingDisabled,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
    disabled: isDraggingDisabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-3 px-4 py-3.5 sm:px-5 ${
        isDragging
          ? "relative rounded-lg bg-card shadow-lg ring-1 ring-border"
          : "transition-colors hover:bg-muted/40"
      }`}
    >
      <button
        type="button"
        aria-label={`Drag ${task.title}`}
        {...attributes}
        {...listeners}
        disabled={isDraggingDisabled}
        className={`shrink-0 touch-none rounded-md p-1.5 text-muted-foreground transition-colors ${
          isDraggingDisabled
            ? "cursor-default opacity-30"
            : "cursor-grab hover:bg-muted hover:text-foreground active:cursor-grabbing"
        }`}
      >
        <GripVertical className="size-4" />
      </button>

      <Link
        to={`/dashboard/workspaces/${workspaceId}/projects/${projectId}/tasks/${task._id}`}
        className="min-w-0 flex-1"
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
              task.status === "done"
                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <CheckCircle2 className="size-4" />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-medium">{task.title}</h3>

            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <UserRound className="size-3.5" />

                {task.assignee?.name ?? "Unassigned"}
              </span>

              <span className="inline-flex items-center gap-1">
                <CalendarDays className="size-3.5" />

                {formatDueDate(task.dueDate)}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Badge
              variant="secondary"
              className={`hidden sm:inline-flex ${getStatusBadgeClass(
                task.status,
              )}`}
            >
              {getStatusLabel(task.status)}
            </Badge>

            <Badge
              variant="secondary"
              className={`hidden md:inline-flex ${getPriorityBadgeClass(
                task.priority,
              )}`}
            >
              {getPriorityLabel(task.priority)}
            </Badge>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SortableTaskRow;
