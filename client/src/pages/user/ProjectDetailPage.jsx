import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FolderKanban,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
  UserRound,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import ErrorState from "@/components/feedback/error/ErrorState";

import { useGetProjectByIdQuery } from "@/features/project/projectApi";
import { useGetProjectTasksQuery } from "@/features/task/taskApi";

import ProjectDialog from "@/features/project/components/ProjectDialog";
import DeleteDialog from "@/features/project/components/DeleteDialog";

import { projectColors, projectIcons } from "@/constants/projectOptions";
import { formatRelativeTime } from "@/utils/date";

const ProjectDetailPage = () => {
  const { workspaceId, projectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchParam = searchParams.get("search") ?? "";

  const statusParam = searchParams.get("status") ?? "";
  const priorityParam = searchParams.get("priority") ?? "";

  const sortByParam = searchParams.get("sortBy") ?? "position";

  const sortOrderParam = searchParams.get("sortOrder") ?? "asc";

  const pageParam = Number(searchParams.get("page"));

  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  const [search, setSearch] = useState(searchParam);

  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    data: projectData,
    isLoading: isProjectLoading,
    isError: isProjectError,
    refetch: refetchProject,
  } = useGetProjectByIdQuery(projectId, {
    skip: !projectId,
  });

  const {
    data: taskData,
    isLoading: isTasksLoading,
    isFetching: isTasksFetching,
    isError: isTasksError,
    error,
    refetch: refetchTasks,
  } = useGetProjectTasksQuery(
    {
      projectId,
      page,
      limit: 20,
      status: statusParam || undefined,
      priority: priorityParam || undefined,
      search: searchParam,
      sortBy: sortByParam,
      sortOrder: sortOrderParam,
    },
    {
      skip: !projectId,
    },
  );

  console.log(error)

  const project = projectData?.data;
  const tasks = taskData?.data?.tasks ?? [];
  const pagination = taskData?.data?.pagination;

  const getProjectIcon = (iconValue) => {
    const iconOption = projectIcons.find((item) => item.value === iconValue);

    return iconOption?.icon ?? FolderKanban;
  };

  const getProjectColorClass = (colorValue) => {
    return (
      projectColors.find((item) => item.value === colorValue)?.className ??
      "bg-muted text-muted-foreground"
    );
  };

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

  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmedSearch = search.trim();

      setSearchParams((params) => {
        if (trimmedSearch) {
          params.set("search", trimmedSearch);
        } else {
          params.delete("search");
        }

        params.delete("page");

        return params;
      });
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, setSearchParams]);

  const handleFilterChange = (key, value) => {
    setSearchParams((params) => {
      params.delete("page");

      if (value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      return params;
    });
  };

  const handleSortChange = (value) => {
    setSearchParams((params) => {
      params.delete("page");

      if (value === "position") {
        params.delete("sortBy");
        params.delete("sortOrder");
      } else {
        params.set("sortBy", value);
        params.set("sortOrder", "asc");
      }

      return params;
    });
  };

  const handlePageChange = (nextPage) => {
    setSearchParams((params) => {
      if (nextPage === 1) {
        params.delete("page");
      } else {
        params.set("page", String(nextPage));
      }

      return params;
    });
  };

  const handleRetry = async () => {
    try {
      await Promise.all([refetchProject().unwrap(), refetchTasks().unwrap()]);
    } catch {}
  };

  if (isProjectError) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState
          title="Unable to load project"
          description="Something went wrong while loading this project."
          onRetry={handleRetry}
        />
      </div>
    );
  }

  if (isProjectLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="mb-6 h-5 w-32" />

        <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <Skeleton className="size-12 shrink-0 rounded-xl" />

            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-80 max-w-full" />
            </div>

            <Skeleton className="size-8 rounded-lg" />
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-card">
          <div className="border-b border-border p-5">
            <Skeleton className="h-5 w-28" />
          </div>

          <div className="divide-y divide-border">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4 px-5 py-4">
                <Skeleton className="size-4 rounded" />

                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-4 w-52" />
                  <Skeleton className="h-3 w-32" />
                </div>

                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const ProjectIcon = getProjectIcon(project?.icon);

  return (
    <>
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          to={`/dashboard/workspaces/${workspaceId}/projects`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Projects
        </Link>

        {/* Project header */}
        <section className="mt-5 rounded-xl border border-border bg-card p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-4">
              <div
                className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${getProjectColorClass(
                  project?.color,
                )}`}
              >
                <ProjectIcon className="size-6" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">
                    {project?.name}
                  </h1>

                  {project?.isArchived && (
                    <Badge variant="secondary">Archived</Badge>
                  )}
                </div>

                <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
                  {project?.description || "No description provided."}
                </p>

                <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock3 className="size-3.5" />
                  Updated {formatRelativeTime(project?.updatedAt)}
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    aria-label="Project actions"
                    className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  />
                }
              >
                <MoreHorizontal className="size-4" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-40 rounded-xl p-1.5"
              >
                <DropdownMenuItem
                  onClick={() => setIsProjectDialogOpen(true)}
                  className="cursor-pointer gap-2 rounded-lg px-2.5 py-2"
                >
                  <Pencil className="size-4" />
                  <span>Edit project</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-1.5" />

                <DropdownMenuItem
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="cursor-pointer gap-2 rounded-lg px-2.5 py-2 text-destructive focus:text-destructive"
                >
                  <Trash2 className="size-4" />
                  <span>Delete project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>

        {/* Tasks */}
        <section className="mt-6 rounded-xl border border-border bg-card">
          <div className="border-b border-border p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-base font-semibold">Tasks</h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Manage tasks in this project.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search tasks..."
                    disabled={isTasksLoading}
                    className="pl-9"
                  />
                </div>

                {/* Status */}
                <Select
                  value={statusParam || "all"}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger className="w-full cursor-pointer sm:w-36">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="todo">To do</SelectItem>
                    <SelectItem value="in_progress">In progress</SelectItem>
                    <SelectItem value="in_review">In review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>

                {/* Priority */}
                <Select
                  value={priorityParam || "all"}
                  onValueChange={(value) =>
                    handleFilterChange("priority", value)
                  }
                >
                  <SelectTrigger className="w-full cursor-pointer sm:w-36">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">All priorities</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortByParam} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-full cursor-pointer sm:w-36">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="position">Position</SelectItem>
                    <SelectItem value="createdAt">Created</SelectItem>
                    <SelectItem value="dueDate">Due date</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {isTasksError ? (
            <div className="p-6">
              <ErrorState
                title="Unable to load tasks"
                description="Something went wrong while loading the tasks."
                onRetry={async () => {
                  try {
                    await refetchTasks().unwrap();
                  } catch {}
                }}
              />
            </div>
          ) : isTasksLoading ? (
            <div className="divide-y divide-border">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 px-5 py-4 sm:px-6"
                >
                  <Skeleton className="size-4 rounded" />

                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-56" />
                    <Skeleton className="h-3 w-32" />
                  </div>

                  <Skeleton className="hidden h-6 w-20 rounded-full sm:block" />
                  <Skeleton className="hidden h-6 w-20 rounded-full md:block" />
                </div>
              ))}
            </div>
          ) : tasks.length === 0 && !isTasksFetching ? (
            <div className="flex min-h-56 flex-col items-center justify-center px-6 text-center">
              <div className="flex size-11 items-center justify-center rounded-full bg-muted">
                <CheckCircle2 className="size-5 text-muted-foreground" />
              </div>

              <h3 className="mt-4 text-sm font-semibold">No tasks found</h3>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {searchParam || statusParam || priorityParam
                  ? "Try adjusting your filters."
                  : "There are no tasks in this project yet."}
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-border">
                {tasks.map((task) => (
                  <Link
                    key={task._id}
                    to={`/dashboard/workspaces/${workspaceId}/projects/${projectId}/tasks/${task._id}`}
                    className="group block px-5 py-4 transition-colors hover:bg-muted/40 sm:px-6"
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
                        <div className="flex min-w-0 items-center gap-2">
                          <h3 className="truncate text-sm font-medium">
                            {task.title}
                          </h3>
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          {task.assignee ? (
                            <span className="inline-flex items-center gap-1">
                              <UserRound className="size-3.5" />
                              {task.assignee.name ?? "Assigned"}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1">
                              <UserRound className="size-3.5" />
                              Unassigned
                            </span>
                          )}

                          <span className="inline-flex items-center gap-1">
                            <CalendarDays className="size-3.5" />
                            {formatDueDate(task.dueDate)}
                          </span>
                        </div>
                      </div>

                      <Badge
                        variant="secondary"
                        className={`hidden shrink-0 sm:inline-flex ${getStatusBadgeClass(
                          task.status,
                        )}`}
                      >
                        {getStatusLabel(task.status)}
                      </Badge>

                      <Badge
                        variant="secondary"
                        className={`hidden shrink-0 md:inline-flex ${getPriorityBadgeClass(
                          task.priority,
                        )}`}
                      >
                        {getPriorityLabel(task.priority)}
                      </Badge>

                      <ChevronDown className="size-4 shrink-0 -rotate-90 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                ))}
              </div>

              {pagination && pagination.totalPages > 1 && (
                <div className="flex flex-col gap-4 border-t border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <p className="text-xs text-muted-foreground">
                    Page {pagination.page} of {pagination.totalPages}
                  </p>

                  <Pagination className="mx-0 w-auto sm:justify-end">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(event) => {
                            event.preventDefault();

                            if (
                              pagination.hasPreviousPage &&
                              !isTasksFetching
                            ) {
                              handlePageChange(page - 1);
                            }
                          }}
                          aria-disabled={
                            !pagination.hasPreviousPage || isTasksFetching
                          }
                          className={
                            !pagination.hasPreviousPage || isTasksFetching
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>

                      {Array.from(
                        {
                          length: pagination.totalPages,
                        },
                        (_, index) => index + 1,
                      ).map((pageNumber) => (
                        <PaginationItem key={pageNumber}>
                          <button
                            type="button"
                            onClick={() => handlePageChange(pageNumber)}
                            disabled={isTasksFetching}
                            className={`inline-flex size-9 cursor-pointer items-center justify-center rounded-md text-sm ${
                              pageNumber === pagination.page
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted"
                            } ${
                              isTasksFetching
                                ? "pointer-events-none opacity-50"
                                : ""
                            }`}
                          >
                            {pageNumber}
                          </button>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(event) => {
                            event.preventDefault();

                            if (pagination.hasNextPage && !isTasksFetching) {
                              handlePageChange(page + 1);
                            }
                          }}
                          aria-disabled={
                            !pagination.hasNextPage || isTasksFetching
                          }
                          className={
                            !pagination.hasNextPage || isTasksFetching
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      <ProjectDialog
        open={isProjectDialogOpen}
        onOpenChange={setIsProjectDialogOpen}
        workspaceId={workspaceId}
        project={project}
      />

      <DeleteDialog
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        selectedProject={project}
      />
    </>
  );
};

export default ProjectDetailPage;
