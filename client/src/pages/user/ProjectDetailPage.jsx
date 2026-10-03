import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FolderKanban,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserRound,
} from "lucide-react";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

import { Skeleton } from "@/components/ui/skeleton";

import ErrorState from "@/components/feedback/error/ErrorState";

import { useGetProjectByIdQuery } from "@/features/project/projectApi";

import {
  useLazyGetProjectTasksQuery,
  useMoveTaskMutation,
} from "@/features/task/taskApi";

import TaskDialog from "@/features/task/components/TaskDialog";
import SortableTaskRow from "@/features/task/components/SortableTaskRow";

import ProjectDialog from "@/features/project/components/ProjectDialog";
import DeleteDialog from "@/features/project/components/DeleteDialog";

import { projectColors, projectIcons } from "@/constants/projectOptions";

import { formatRelativeTime } from "@/utils/date";

const TASKS_PER_LOAD = 50;

const ProjectDetailPage = () => {
  const { workspaceId, projectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchParam = searchParams.get("search") ?? "";
  const statusParam = searchParams.get("status") ?? "";
  const priorityParam = searchParams.get("priority") ?? "";
  const assigneeParam = searchParams.get("assignee") ?? "";
  const sortByParam = searchParams.get("sortBy") ?? "position";
  const sortOrderParam = searchParams.get("sortOrder") ?? "asc";

  const [search, setSearch] = useState(searchParam);

  const [tasks, setTasks] = useState([]);
  const [loadedPages, setLoadedPages] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshingTasks, setIsRefreshingTasks] = useState(false);

  const [activeTaskId, setActiveTaskId] = useState(null);
  const [isReordering, setIsReordering] = useState(false);

  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);

  const [selectedTask, setSelectedTask] = useState(null);

  const {
    data: projectData,
    isLoading: isProjectLoading,
    isError: isProjectError,
    refetch: refetchProject,
  } = useGetProjectByIdQuery(projectId, {
    skip: !projectId,
  });

  const [
    fetchProjectTasks,
    { isFetching: isTasksFetching, isError: isTasksError },
  ] = useLazyGetProjectTasksQuery();

  const [moveTask] = useMoveTaskMutation();

  const project = projectData?.data;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );

  const canReorder =
    !searchParam &&
    !statusParam &&
    !priorityParam &&
    !assigneeParam &&
    sortByParam === "position" &&
    sortOrderParam === "asc";

  const activeTask = useMemo(
    () => tasks.find((task) => task._id === activeTaskId),
    [tasks, activeTaskId],
  );

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

  const resetTaskList = () => {
    setTasks([]);
    setLoadedPages(0);
    setHasMore(false);
  };

  const loadTasks = async (page, replace = false) => {
    if (!projectId) return;

    try {
      const result = await fetchProjectTasks({
        projectId,
        page,
        limit: TASKS_PER_LOAD,
        status: statusParam || undefined,
        priority: priorityParam || undefined,
        assignee: assigneeParam || undefined,
        search: searchParam || undefined,
        sortBy: sortByParam,
        sortOrder: sortOrderParam,
      }).unwrap();

      const incomingTasks = result?.data?.tasks ?? [];
      const pagination = result?.data?.pagination;

      setTasks((previous) => {
        if (replace) {
          return incomingTasks;
        }

        const existingIds = new Set(previous.map((task) => task._id));

        const uniqueIncoming = incomingTasks.filter(
          (task) => !existingIds.has(task._id),
        );

        return [...previous, ...uniqueIncoming];
      });

      setLoadedPages(page);

      setHasMore(Boolean(pagination?.hasNextPage));
    } catch {
      if (replace) {
        setTasks([]);
        setLoadedPages(0);
      }

      throw new Error("Failed to load tasks.");
    }
  };

  useEffect(() => {
    if (!projectId) return;

    let cancelled = false;

    const run = async () => {
      setIsRefreshingTasks(true);

      try {
        const result = await fetchProjectTasks({
          projectId,
          page: 1,
          limit: TASKS_PER_LOAD,
          status: statusParam || undefined,
          priority: priorityParam || undefined,
          assignee: assigneeParam || undefined,
          search: searchParam || undefined,
          sortBy: sortByParam,
          sortOrder: sortOrderParam,
        }).unwrap();

        if (cancelled) return;

        setTasks(result?.data?.tasks ?? []);
        setLoadedPages(1);
        setHasMore(Boolean(result?.data?.pagination?.hasNextPage));
      } catch {
        if (!cancelled) {
          setTasks([]);
          setLoadedPages(0);
          setHasMore(false);
        }
      } finally {
        if (!cancelled) {
          setIsRefreshingTasks(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [
    projectId,
    searchParam,
    statusParam,
    priorityParam,
    assigneeParam,
    sortByParam,
    sortOrderParam,
    fetchProjectTasks,
  ]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const trimmedSearch = search.trim();

      if (trimmedSearch === searchParam) return;

      setSearchParams((params) => {
        if (trimmedSearch) {
          params.set("search", trimmedSearch);
        } else {
          params.delete("search");
        }

        return params;
      });
    }, 400);

    return () => clearTimeout(timeout);
  }, [search, searchParam, setSearchParams]);

  const handleFilterChange = (key, value) => {
    setSearchParams((params) => {
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

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore || loadedPages === 0) {
      return;
    }

    setIsLoadingMore(true);

    try {
      await loadTasks(loadedPages + 1);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleRetry = async () => {
    try {
      await refetchProject();

      setIsRefreshingTasks(true);

      const result = await fetchProjectTasks({
        projectId,
        page: 1,
        limit: TASKS_PER_LOAD,
        status: statusParam || undefined,
        priority: priorityParam || undefined,
        assignee: assigneeParam || undefined,
        search: searchParam || undefined,
        sortBy: sortByParam,
        sortOrder: sortOrderParam,
      }).unwrap();

      setTasks(result?.data?.tasks ?? []);
      setLoadedPages(1);
      setHasMore(Boolean(result?.data?.pagination?.hasNextPage));
    } catch {
      // Error state remains visible.
    } finally {
      setIsRefreshingTasks(false);
    }
  };

  const openCreateTask = () => {
    setSelectedTask(null);
    setIsTaskDialogOpen(true);
  };

  const handleDragStart = ({ active }) => {
    if (!canReorder || isReordering) return;

    setActiveTaskId(active.id);
  };

  const handleDragCancel = () => {
    setActiveTaskId(null);
  };

  const handleDragEnd = async ({ active, over }) => {
    setActiveTaskId(null);

    if (!canReorder || !over || active.id === over.id) {
      return;
    }

    const oldIndex = tasks.findIndex((task) => task._id === active.id);

    const newIndex = tasks.findIndex((task) => task._id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const reorderedTasks = arrayMove(tasks, oldIndex, newIndex);

    const movedTask = reorderedTasks[newIndex];

    const beforeTask = reorderedTasks[newIndex + 1] ?? null;

    setTasks(reorderedTasks);
    setIsReordering(true);

    try {
      await moveTask({
        taskId: movedTask._id,
        beforeTaskId: beforeTask?._id ?? null,
      }).unwrap();
    } catch {
      setTasks(tasks);
    } finally {
      setIsReordering(false);
    }
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

                <Skeleton className="hidden h-6 w-20 rounded-full sm:block" />
                <Skeleton className="hidden h-6 w-20 rounded-full md:block" />
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
        <Link
          to={`/dashboard/workspaces/${workspaceId}/projects`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Projects
        </Link>

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

        <section className="mt-6 rounded-xl border border-border bg-card">
          <div className="border-b border-border p-5 sm:p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-base font-semibold">Tasks</h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Manage tasks in this project.
                  </p>
                </div>

                <Button onClick={openCreateTask} className="w-full sm:w-auto">
                  <Plus className="size-4" />
                  Create task
                </Button>
              </div>

              <div className="flex flex-col gap-3 lg:flex-row">
                <div className="relative w-full lg:w-64">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search tasks..."
                    disabled={isRefreshingTasks}
                    className="pl-9"
                  />
                </div>

                <Select
                  value={statusParam || "all"}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger className="w-full cursor-pointer sm:w-40">
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

                <Select
                  value={priorityParam || "all"}
                  onValueChange={(value) =>
                    handleFilterChange("priority", value)
                  }
                >
                  <SelectTrigger className="w-full cursor-pointer sm:w-40">
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

                <Select value={sortByParam} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-full cursor-pointer sm:w-40">
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

              {!canReorder && tasks.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Drag-and-drop is available when viewing all tasks in position
                  order.
                </p>
              )}
            </div>
          </div>

          {isTasksError && tasks.length === 0 ? (
            <div className="p-6">
              <ErrorState
                title="Unable to load tasks"
                description="Something went wrong while loading the tasks."
                onRetry={handleRetry}
              />
            </div>
          ) : isRefreshingTasks && tasks.length === 0 ? (
            <div className="divide-y divide-border">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center gap-4 px-5 py-4">
                  <Skeleton className="size-5 rounded" />

                  <Skeleton className="size-8 rounded-full" />

                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-56" />
                    <Skeleton className="h-3 w-32" />
                  </div>

                  <Skeleton className="hidden h-6 w-20 rounded-full sm:block" />
                  <Skeleton className="hidden h-6 w-20 rounded-full md:block" />
                </div>
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex min-h-56 flex-col items-center justify-center px-6 text-center">
              <div className="flex size-11 items-center justify-center rounded-full bg-muted">
                <CheckCircle2 className="size-5 text-muted-foreground" />
              </div>

              <h3 className="mt-4 text-sm font-semibold">No tasks found</h3>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {searchParam || statusParam || priorityParam || assigneeParam
                  ? "Try adjusting your filters."
                  : "There are no tasks in this project yet."}
              </p>

              {!searchParam &&
                !statusParam &&
                !priorityParam &&
                !assigneeParam && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={openCreateTask}
                  >
                    <Plus className="size-4" />
                    Create task
                  </Button>
                )}
            </div>
          ) : (
            <>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragCancel={handleDragCancel}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={tasks.map((task) => task._id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="divide-y divide-border">
                    {tasks.map((task) => (
                      <SortableTaskRow
                        key={task._id}
                        task={task}
                        workspaceId={workspaceId}
                        projectId={projectId}
                        isDraggingDisabled={
                          !canReorder || isReordering || isTasksFetching
                        }
                      />
                    ))}
                  </div>
                </SortableContext>

                <DragOverlay>
                  {activeTask ? (
                    <div className="rounded-lg border border-border bg-card px-5 py-4 shadow-xl">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="size-4 text-muted-foreground" />

                        <span className="text-sm font-medium">
                          {activeTask.title}
                        </span>
                      </div>
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>

              {isReordering && (
                <div className="flex items-center justify-center gap-2 border-t border-border px-5 py-3 text-xs text-muted-foreground">
                  <Loader2 className="size-3.5 animate-spin" />
                  Saving new task order...
                </div>
              )}

              {hasMore && (
                <div className="flex justify-center border-t border-border px-5 py-5">
                  <Button
                    variant="outline"
                    onClick={handleLoadMore}
                    disabled={isLoadingMore || isReordering}
                  >
                    {isLoadingMore && (
                      <Loader2 className="size-4 animate-spin" />
                    )}

                    {isLoadingMore ? "Loading..." : "Load more tasks"}
                  </Button>
                </div>
              )}

              {!hasMore && tasks.length > 0 && (
                <div className="border-t border-border px-5 py-4 text-center text-xs text-muted-foreground">
                  You've reached the end of the task list.
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

      <TaskDialog
        open={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        projectId={projectId}
        workspaceId={workspaceId}
        task={selectedTask}
      />
    </>
  );
};

export default ProjectDetailPage;
