import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  MessageCircle,
  MoreHorizontal,
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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

import ErrorState from "@/components/feedback/error/ErrorState";

import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetTaskCommentsQuery,
  useUpdateCommentMutation,
} from "@/features/comment/commentApi";

import {
  useDeleteTaskMutation,
  useGetTaskByIdQuery,
} from "@/features/task/taskApi";

import { useGetMyWorkspaceMembershipQuery } from "@/features/workspace/workspaceApi";

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

const getInitials = (name) => {
  if (!name) return "U";

  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const TaskDetailPage = () => {
  const { workspaceId, projectId, taskId } = useParams();
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.auth.user);
  const currentUserId = currentUser?._id;

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [commentPage, setCommentPage] = useState(1);
  const [commentContent, setCommentContent] = useState("");

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  const [deletingCommentId, setDeletingCommentId] = useState(null);

  const { data, isLoading, isError, refetch } = useGetTaskByIdQuery(taskId, {
    skip: !taskId,
  });

  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  const task = data?.data;

  const {
    data: commentsData,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    refetch: refetchComments,
  } = useGetTaskCommentsQuery(
    {
      taskId,
      page: commentPage,
      limit: 20,
    },
    {
      skip: !taskId,
    },
  );

  const { data: membershipData } = useGetMyWorkspaceMembershipQuery(
    workspaceId,
    {
      skip: !workspaceId,
    },
  );

  const currentUserRole = membershipData?.data?.role;

  const [createComment, { isLoading: isCreatingComment }] =
    useCreateCommentMutation();

  const [updateComment, { isLoading: isUpdatingComment }] =
    useUpdateCommentMutation();

  const [deleteComment, { isLoading: isDeletingComment }] =
    useDeleteCommentMutation();

  const comments = commentsData?.data?.comments ?? [];
  const commentPagination = commentsData?.data?.pagination;

  const handleDelete = async () => {
    try {
      await deleteTask(taskId).unwrap();

      navigate(`/dashboard/workspaces/${workspaceId}/projects/${projectId}`);
    } catch {
      // Keep dialog open if deletion fails.
    }
  };

  const handleCreateComment = async (event) => {
    event.preventDefault();

    const content = commentContent.trim();

    if (!content) return;

    try {
      await createComment({
        taskId,
        data: {
          content,
        },
      }).unwrap();

      setCommentContent("");

      if (commentPage !== 1) {
        setCommentPage(1);
      } else {
        refetchComments();
      }
    } catch (error) {
      console.log(error)
      // Keep the entered content if creation fails.
    }
  };

  const handleStartEditing = (comment) => {
    setEditingCommentId(comment._id);
    setEditingContent(comment.content);
  };

  const handleCancelEditing = () => {
    setEditingCommentId(null);
    setEditingContent("");
  };

  const handleUpdateComment = async (commentId) => {
    const content = editingContent.trim();

    if (!content) return;

    try {
      await updateComment({
        commentId,
        data: {
          content,
        },
      }).unwrap();

      handleCancelEditing();
    } catch {
      // Keep edit mode open if updating fails.
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId).unwrap();

      setDeletingCommentId(null);

      if (comments.length === 1 && commentPage > 1) {
        setCommentPage((page) => page - 1);
      }
    } catch {
      // Keep dialog open if deletion fails.
    }
  };

  const canDeleteComment = (comment) => {
    const isAuthor = comment.user?._id === currentUserId;

    const isAdminOrOwner =
      currentUserRole === "admin" || currentUserRole === "owner";

    return isAuthor || isAdminOrOwner;
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

        {/* Task */}
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

        {/* Comments */}
        <section className="mt-5 rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4 sm:px-6">
            <div className="flex items-center gap-2">
              <MessageCircle className="size-4 text-muted-foreground" />

              <h2 className="text-sm font-semibold">Comments</h2>

              {commentPagination?.total > 0 && (
                <span className="text-xs text-muted-foreground">
                  ({commentPagination.total})
                </span>
              )}
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {/* Create comment */}
            <form onSubmit={handleCreateComment}>
              <Textarea
                value={commentContent}
                onChange={(event) => setCommentContent(event.target.value)}
                placeholder="Write a comment..."
                maxLength={2000}
                disabled={isCreatingComment}
                className="min-h-24 resize-none"
              />

              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                  {commentContent.length}/2000
                </p>

                <Button
                  type="submit"
                  size="sm"
                  disabled={isCreatingComment || !commentContent.trim()}
                >
                  {isCreatingComment && (
                    <Loader2 className="size-4 animate-spin" />
                  )}
                  Comment
                </Button>
              </div>
            </form>

            {/* Comments list */}
            <div className="mt-6">
              {isCommentsLoading ? (
                <div className="space-y-6">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex gap-3">
                      <Skeleton className="size-9 shrink-0 rounded-full" />

                      <div className="min-w-0 flex-1 space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-full max-w-xl" />
                        <Skeleton className="h-4 w-2/3 max-w-md" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : isCommentsError ? (
                <ErrorState
                  title="Unable to load comments"
                  description="Something went wrong while loading the comments."
                  onRetry={refetchComments}
                />
              ) : comments.length === 0 ? (
                <div className="py-8 text-center">
                  <MessageCircle className="mx-auto size-8 text-muted-foreground/60" />

                  <p className="mt-3 text-sm font-medium">No comments yet</p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Start the conversation about this task.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {comments.map((comment) => {
                    const isAuthor = comment.user?._id === currentUserId;

                    const canDelete = canDeleteComment(comment);

                    const isEditing = editingCommentId === comment._id;

                    return (
                      <div key={comment._id} className="flex gap-3">
                        <Avatar className="size-9 shrink-0">
                          <AvatarImage
                            src={comment.user?.avatar ?? undefined}
                            alt={comment.user?.name ?? "User"}
                          />

                          <AvatarFallback>
                            {getInitials(comment.user?.name)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-medium">
                                {comment.user?.name ?? "Unknown user"}
                              </p>

                              <p className="text-xs text-muted-foreground">
                                {formatRelativeTime(comment.createdAt)}

                                {comment.updatedAt !== comment.createdAt && (
                                  <span> · edited</span>
                                )}
                              </p>
                            </div>

                            {(isAuthor || canDelete) && !isEditing && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 shrink-0"
                                  >
                                    <MoreHorizontal className="size-4" />

                                    <span className="sr-only">
                                      Comment actions
                                    </span>
                                  </Button>
                                </DropdownMenuTrigger>

                                <DropdownMenuContent align="end">
                                  {isAuthor && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleStartEditing(comment)
                                      }
                                    >
                                      <Pencil className="size-4" />
                                      Edit
                                    </DropdownMenuItem>
                                  )}

                                  {canDelete && (
                                    <DropdownMenuItem
                                      variant="destructive"
                                      onClick={() =>
                                        setDeletingCommentId(comment._id)
                                      }
                                    >
                                      <Trash2 className="size-4" />
                                      Delete
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>

                          {isEditing ? (
                            <div className="mt-3">
                              <Textarea
                                value={editingContent}
                                onChange={(event) =>
                                  setEditingContent(event.target.value)
                                }
                                maxLength={2000}
                                disabled={isUpdatingComment}
                                className="min-h-24 resize-none"
                              />

                              <div className="mt-2 flex justify-end gap-2">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={handleCancelEditing}
                                  disabled={isUpdatingComment}
                                >
                                  Cancel
                                </Button>

                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateComment(comment._id)
                                  }
                                  disabled={
                                    isUpdatingComment || !editingContent.trim()
                                  }
                                >
                                  {isUpdatingComment && (
                                    <Loader2 className="size-4 animate-spin" />
                                  )}
                                  Save
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-foreground/90">
                              {comment.content}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Comment pagination */}
              {commentPagination && commentPagination.totalPages > 1 && (
                <div className="mt-6 flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-muted-foreground">
                    Page {commentPagination.page} of{" "}
                    {commentPagination.totalPages}
                  </p>

                  <Pagination className="mx-0 w-auto sm:justify-end">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(event) => {
                            event.preventDefault();

                            if (commentPagination.hasPreviousPage) {
                              setCommentPage((page) => page - 1);
                            }
                          }}
                          className={
                            !commentPagination.hasPreviousPage
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(event) => {
                            event.preventDefault();

                            if (commentPagination.hasNextPage) {
                              setCommentPage((page) => page + 1);
                            }
                          }}
                          className={
                            !commentPagination.hasNextPage
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Edit task */}
      <TaskDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        projectId={projectId}
        workspaceId={workspaceId}
        task={task}
      />

      {/* Delete task */}
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

      {/* Delete comment */}
      <AlertDialog
        open={Boolean(deletingCommentId)}
        onOpenChange={(open) => {
          if (!open && !isDeletingComment) {
            setDeletingCommentId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete comment?</AlertDialogTitle>

            <AlertDialogDescription>
              This comment will be permanently deleted. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingComment}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={() => handleDeleteComment(deletingCommentId)}
              disabled={isDeletingComment || !deletingCommentId}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletingComment && <Loader2 className="size-4 animate-spin" />}
              Delete comment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TaskDetailPage;
