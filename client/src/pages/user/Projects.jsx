import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  Clock3,
  FolderKanban,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useGetMyWorkspaceMembershipQuery } from "@/features/workspace/workspaceApi";
import { useGetWorkspaceProjectsQuery } from "@/features/project/projectApi";

import ProjectDialog from "@/features/project/components/ProjectDialog";
import DeleteDialog from "@/features/project/components/DeleteDialog";

import { projectColors, projectIcons } from "@/constants/projectOptions";
import { formatRelativeTime } from "@/utils/date";

const ProjectsPage = () => {
  const { workspaceId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchParam = searchParams.get("search") ?? "";

  const pageParam = Number(searchParams.get("page"));

  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  const archivedParam = searchParams.get("archived");

  const archived =
    archivedParam === "true"
      ? true
      : archivedParam === "false"
        ? false
        : undefined;

  const filterValue =
    archivedParam === "true"
      ? "archived"
      : archivedParam === "false"
        ? "active"
        : "all";

  const [search, setSearch] = useState(searchParam);

  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);

  const [selectedProject, setSelectedProject] = useState(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data, isLoading, isFetching, isError, refetch } =
    useGetWorkspaceProjectsQuery(
      {
        workspaceId,
        page,
        limit: 20,
        search: searchParam,
        archived,
      },
      {
        skip: !workspaceId,
      },
    );

  const { data: membershipData } = useGetMyWorkspaceMembershipQuery(
    workspaceId,
    {
      skip: !workspaceId,
    },
  );

  const projects = data?.data?.projects ?? [];
  const pagination = data?.data?.pagination;

  const currentUserRole = membershipData?.data?.role;

  const canManageProjects =
    currentUserRole === "owner" || currentUserRole === "admin";

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

  const handleFilterChange = (value) => {
    setSearchParams((params) => {
      params.delete("page");

      if (value === "active") {
        params.set("archived", "false");
      } else if (value === "archived") {
        params.set("archived", "true");
      } else {
        params.delete("archived");
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

  const handleCreateProject = () => {
    setSelectedProject(null);
    setIsProjectDialogOpen(true);
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setIsProjectDialogOpen(true);
  };

  const handleDeleteProject = (project) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };

  const handleRetry = async () => {
    try {
      await refetch().unwrap();
    } catch {}
  };

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

  if (isError) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorState
          title="Unable to load projects"
          description="Something went wrong while loading the projects."
          onRetry={handleRetry}
        />
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage projects and organize work in this workspace.
            </p>
          </div>

          <Button
            type="button"
            onClick={handleCreateProject}
            className="cursor-pointer"
          >
            <Plus data-icon="inline-start" />
            New project
          </Button>
        </div>

        {/* Search + filter */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search projects..."
              disabled={isLoading}
              className="pl-9"
            />
          </div>

          <Select value={filterValue} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-full cursor-pointer sm:w-36">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="active">Active</SelectItem>

              <SelectItem value="archived">Archived</SelectItem>

              <SelectItem value="all">All projects</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Projects */}
        <section className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
          {isLoading ? (
            <div className="divide-y divide-border">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="px-5 py-4 sm:px-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start gap-3">
                        <Skeleton className="size-9 shrink-0 rounded-lg" />

                        <div className="min-w-0 flex-1 space-y-2">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-3 w-64 max-w-full" />
                        </div>
                      </div>

                      <Skeleton className="mt-3 h-3 w-28" />
                    </div>

                    <Skeleton className="size-8 shrink-0 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : projects.length === 0 && !isFetching ? (
            <div className="flex min-h-56 flex-col items-center justify-center px-6 text-center">
              <div className="flex size-11 items-center justify-center rounded-full bg-muted">
                <FolderKanban className="size-5 text-muted-foreground" />
              </div>

              <h2 className="mt-4 text-sm font-semibold">No projects found</h2>

              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {searchParam
                  ? "Try adjusting your search."
                  : archived
                    ? "There are no archived projects."
                    : "Create your first project to get started."}
              </p>

              {!searchParam && !archived && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCreateProject}
                  className="mt-4 cursor-pointer"
                >
                  <Plus data-icon="inline-start" />
                  Create project
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="divide-y divide-border">
                {projects.map((project) => {
                  const Icon = getProjectIcon(project.icon);

                  return (
                    <div
                      key={project._id}
                      className="group px-5 py-4 transition-colors hover:bg-muted/40 sm:px-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        {/* Clickable project */}
                        <Link
                          to={`/dashboard/workspaces/${workspaceId}/projects/${project._id}`}
                          className="min-w-0 flex-1"
                        >
                          <div className="flex min-w-0 items-start gap-3">
                            <div
                              className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${getProjectColorClass(
                                project.color,
                              )}`}
                            >
                              <Icon className="size-4" />
                            </div>

                            <div className="min-w-0">
                              <div className="flex min-w-0 items-center gap-2">
                                <h3 className="truncate text-sm font-medium">
                                  {project.name}
                                </h3>

                                {project.isArchived && (
                                  <Badge
                                    variant="secondary"
                                    className="shrink-0"
                                  >
                                    Archived
                                  </Badge>
                                )}
                              </div>

                              <p className="mt-1 truncate text-xs text-muted-foreground">
                                {project.description || "No description"}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <Clock3 className="size-3.5" />
                            Updated {formatRelativeTime(project.updatedAt)}
                          </div>
                        </Link>

                        {/* Actions */}
                        {canManageProjects && (
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={
                                <button
                                  type="button"
                                  aria-label={`Actions for ${project.name}`}
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
                                onClick={() => handleEditProject(project)}
                                className="cursor-pointer gap-2 rounded-lg px-2.5 py-2"
                              >
                                <Pencil className="size-4" />
                                <span>Edit project</span>
                              </DropdownMenuItem>

                              <DropdownMenuSeparator className="my-1.5" />

                              <DropdownMenuItem
                                onClick={() => handleDeleteProject(project)}
                                className="cursor-pointer gap-2 rounded-lg px-2.5 py-2 text-destructive focus:text-destructive"
                              >
                                <Trash2 className="size-4" />
                                <span>Delete project</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
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

                            if (pagination.hasPreviousPage && !isFetching) {
                              handlePageChange(page - 1);
                            }
                          }}
                          aria-disabled={
                            !pagination.hasPreviousPage || isFetching
                          }
                          className={
                            !pagination.hasPreviousPage || isFetching
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
                            disabled={isFetching}
                            className={`inline-flex size-9 cursor-pointer items-center justify-center rounded-md text-sm ${
                              pageNumber === pagination.page
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted"
                            } ${
                              isFetching ? "pointer-events-none opacity-50" : ""
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

                            if (pagination.hasNextPage && !isFetching) {
                              handlePageChange(page + 1);
                            }
                          }}
                          aria-disabled={!pagination.hasNextPage || isFetching}
                          className={
                            !pagination.hasNextPage || isFetching
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
        project={selectedProject}
      />

      <DeleteDialog
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        selectedProject={selectedProject}
      />
    </>
  );
};

export default ProjectsPage;
