import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
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
  const [searchParams, setSearchParams] = useSearchParams();

  const { workspaceId } = useParams();

  const searchParam = searchParams.get("search") ?? "";
  const pageParam = Number(searchParams.get("page"));

  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  const archivedParam = searchParams.get("archived");

  const archived =
    archivedParam === "true" ? true : archivedParam === "false" ? false : false;

  const filterValue =
    archivedParam === "true"
      ? "archived"
      : archivedParam === "false"
        ? "active"
        : "active";

  const [search, setSearch] = useState(searchParam);

  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data, isLoading, isFetching, isError, error, refetch } =
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

  const { data: membershipData, isLoading: isMembershipLoading } =
    useGetMyWorkspaceMembershipQuery(workspaceId, {
      skip: !workspaceId,
    });

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

  const getProjectColor = (colorValue) => {
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

        <section className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
          {isLoading ? (
            <div className="divide-y divide-border">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 px-4 py-4 sm:px-5"
                >
                  <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />

                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-64 max-w-full" />
                  </div>

                  <Skeleton className="hidden h-4 w-20 md:block" />

                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              ))}
            </div>
          ) : projects.length === 0 && !isFetching ? (
            <div className="flex min-h-56 flex-col items-center justify-center px-6 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
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
                  const ProjectIcon = getProjectIcon(project.icon);
                  const projectColor = getProjectColor(project.color);

                  return (
                    <div
                      key={project._id}
                      className="flex items-center gap-3 px-4 py-4 sm:gap-4 sm:px-5"
                    >
                      <Link
                        to={`/dashboard/workspaces/${workspaceId}/projects/${project._id}`}
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${projectColor}`}
                      >
                        <ProjectIcon className="size-5" />
                      </Link>

                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 items-center gap-2">
                          <Link
                            to={`/dashboard/workspaces/${workspaceId}/projects/${project._id}`}
                            className="truncate text-sm font-medium hover:underline"
                          >
                            {project.name}
                          </Link>

                          {project.isArchived && (
                            <Badge variant="secondary" className="shrink-0">
                              Archived
                            </Badge>
                          )}
                        </div>

                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {project.description || "No description"}
                        </p>
                      </div>

                      <p className="hidden w-24 text-right text-xs text-muted-foreground md:block">
                        {formatRelativeTime(project.updatedAt)}
                      </p>

                      {canManageProjects && !isMembershipLoading && (
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <button
                                type="button"
                                className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                                aria-label={`Actions for ${project.name}`}
                              />
                            }
                          >
                            <MoreHorizontal className="size-4" />
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem
                              onClick={() => handleEditProject(project)}
                              className="cursor-pointer"
                            >
                              <Pencil data-icon="inline-start" />
                              Edit project
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => handleDeleteProject(project)}
                              className="cursor-pointer"
                            >
                              <Trash2 data-icon="inline-start" />
                              Delete project
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  );
                })}
              </div>

              {pagination && pagination.totalPages > 0 && (
                <div className="flex flex-col gap-4 border-t border-border px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
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
                        { length: pagination.totalPages },
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
