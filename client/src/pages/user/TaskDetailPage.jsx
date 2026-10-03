import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  Pencil,
  Trash2,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Skeleton } from "@/components/ui/skeleton";

import ErrorState from "@/components/feedback/error/ErrorState";

import {
  useDeleteTaskMutation,
  useGetTaskByIdQuery,
} from "@/features/task/taskApi";

import TaskDialog from "@/features/task/components/TaskDialog";

import { formatRelativeTime } from "@/utils/date";

const statusLabels = {
  todo: "To do",
  in_progress: "In progress",
  in_review: "In review",
  done: "Done",
};

const priorityLabels = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

const statusClasses = {
  todo: "bg-muted text-muted-foreground",
  in_progress: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  in_review: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  done: "bg-green-500/10 text-green-600 dark:text-green-400",
};

const priorityClasses = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  high: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  urgent: "bg-red-500/10 text-red-600 dark:text-red-400",
};

const formatDueDate = (date) => {
  if (!date) return "No due date";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

const TaskDetailPage = () => {
  const { workspaceId, projectId, taskId } = useParams();
  const navigate = useNavigate();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useGetTaskByIdQuery(taskId, {
    skip: !taskId,
  });

  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  const task = data?.data;

  const handleDelete = async () => {
    try {
      await deleteTask(taskId).unwrap();

      navigate(`/dashboard/workspaces/${workspaceId}/projects/${projectId}`);
    } catch {
      // Keep dialog open if deletion fails.
    }
  };

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState
          title="Unable to load task"
          description="Something went wrong while loading this task."
          onRetry={refetch}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="mb-6 h-5 w-32" />

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="space-y-4">
            <Skeleton className="h-7 w-80" />
            <Skeleton className="h-4 w-full max-w-2xl" />
            <Skeleton className="h-4 w-3/4 max-w-xl" />

            <div className="flex gap-3 pt-4">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to={`/dashboard/workspaces/${workspaceId}/projects/${projectId}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to project
        </Link>

        <section className="mt-5 rounded-xl border border-border bg-card">
          <div className="flex flex-col gap-5 border-b border-border p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
                      task.status === "done"
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <CheckCircle2 className="size-4" />
                  </div>

                  <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                    {task.title}
                  </h1>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className={statusClasses[task.status]}
                  >
                    {statusLabels[task.status] ?? task.status}
                  </Badge>

                  <Badge
                    variant="secondary"
                    className={priorityClasses[task.priority]}
                  >
                    {priorityLabels[task.priority] ?? task.priority}
                  </Badge>
                </div>
              </div>

              <div className="flex shrink-0 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditOpen(true)}
                >
                  <Pencil className="size-4" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDeleteOpen(true)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <UserRound className="size-3.5" />

                {task.assignee?.name ?? "Unassigned"}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-3.5" />

                {formatDueDate(task.dueDate)}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="size-3.5" />
                Updated {formatRelativeTime(task.updatedAt)}
              </span>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <h2 className="text-sm font-semibold">Description</h2>

            <div className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
              {task.description || "No description provided."}
            </div>
          </div>
        </section>
      </div>

      <TaskDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        projectId={projectId}
        workspaceId={workspaceId}
        task={task}
      />

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete task?</AlertDialogTitle>

            <AlertDialogDescription>
              This will permanently delete "{task.title}". This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting && <Loader2 className="size-4 animate-spin" />}
              Delete task
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TaskDetailPage;
