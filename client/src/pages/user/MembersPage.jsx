import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  MoreHorizontal,
  Search,
  UserPlus,
  Users,
  Pencil,
  Trash2,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import ErrorState from "@/components/feedback/error/ErrorState";

import { useGetWorkspaceMembersQuery } from "@/features/workspace/workspaceApi";
import { formatRelativeTime } from "@/utils/date";
import InviteMemberDialog from "@/features/workspace/components/InviteMemberDialog";
import UpdateMemberRoleDialog from "@/features/workspace/components/UpdateMemberRoleDialog";
import RemoveMemberDialog from "@/features/workspace/components/RemoveMemberDialog";

const MembersPage = () => {
  const { workspaceId } = useParams();

  const [isRetrying, setIsRetrying] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isUpdateMemberRoleDialogOpen, setIsUpdateMemberRoleDialogOpen] =
    useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);

  const [selectedMember, setSelectedMember] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const searchParam = searchParams.get("search") ?? "";
  const pageParam = Number(searchParams.get("page"));

  const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  const limit = 20;

  const [search, setSearch] = useState(searchParam);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchParams((params) => {
        const trimmedSearch = search.trim();

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

  const { data, isLoading, isError, isFetching, refetch } =
    useGetWorkspaceMembersQuery({
      workspaceId,
      page,
      limit,
      search: searchParam,
    });

  const members = data?.data?.members ?? [];
  const pagination = data?.data?.pagination;
  const currentUserRole = data?.data?.currentUserRole;

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handlePageChange = (event, pageNumber) => {
    event.preventDefault();

    if (page === pageNumber || isFetching) return;

    setSearchParams((params) => {
      if (pageNumber === 1) {
        params.delete("page");
      } else {
        params.set("page", String(pageNumber));
      }

      return params;
    });
  };

  const handlePreviousPage = (event) => {
    event.preventDefault();

    if (!pagination?.hasPreviousPage || isFetching) return;

    setSearchParams((params) => {
      if (page - 1 === 1) {
        params.delete("page");
      } else {
        params.set("page", String(page - 1));
      }

      return params;
    });
  };

  const handleNextPage = (event) => {
    event.preventDefault();

    if (!pagination?.hasNextPage || isFetching) return;

    setSearchParams((params) => {
      params.set("page", String(page + 1));
      return params;
    });
  };

  const handleRetry = async () => {
    setIsRetrying(true);

    try {
      await refetch().unwrap();
    } catch {
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Members</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage the people who have access to this workspace.
          </p>
        </div>

        <Button
          className="cursor-pointer"
          onClick={() => setIsInviteDialogOpen(true)}
        >
          <UserPlus data-icon="inline-start" />
          Invite member
        </Button>
      </div>

      <div className="mt-8">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            type="search"
            placeholder="Search members..."
            value={search}
            onChange={handleSearchChange}
            className="pl-9"
            disabled={isLoading}
          />
        </div>
      </div>

      <section className="mt-6">
        {isLoading ? (
          <div className="divide-y divide-border">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 px-3 py-4 sm:px-4"
              >
                <Skeleton className="h-9 w-9 shrink-0 rounded-full" />

                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-32 rounded-md" />
                  <Skeleton className="h-3 w-40 rounded-md" />
                </div>

                <Skeleton className="hidden h-6 w-16 rounded-md sm:block" />

                <Skeleton className="hidden h-3 w-20 rounded-md md:block" />

                <Skeleton className="h-8 w-8 shrink-0 rounded-md" />
              </div>
            ))}
          </div>
        ) : isError || isRetrying ? (
          <ErrorState
            title="Couldn't load members"
            description="We couldn't load the workspace members. Please try again."
            onRetry={handleRetry}
            isRetrying={isRetrying}
            className="py-16"
          />
        ) : members.length === 0 && !isFetching ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>

            <p className="mt-4 text-sm font-medium">
              {searchParam ? "No members found" : "No members yet"}
            </p>

            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              {searchParam
                ? `No members match "${searchParam}".`
                : "Invite people to collaborate in this workspace."}
            </p>

            {!searchParam && (
              <Button className="mt-4 cursor-pointer" size="sm">
                <UserPlus data-icon="inline-start" />
                Invite member
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="divide-y divide-border">
              {members.map((member) => {
                const canChangeRole =
                  currentUserRole === "owner" && member.role !== "owner";

                const canRemoveMember =
                  currentUserRole === "owner"
                    ? member.role !== "owner"
                    : currentUserRole === "admin"
                      ? member.role === "member"
                      : false;

                const canManageMember = canChangeRole || canRemoveMember;

                const user = member.user;

                const initials =
                  user?.name
                    ?.split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() ?? "?";

                return (
                  <div
                    key={member._id}
                    className="flex items-center gap-3 px-3 py-4 sm:px-4"
                  >
                    <Avatar className="h-9 w-9 shrink-0">
                      <AvatarImage
                        src={user?.avatar ?? undefined}
                        alt={user?.name ?? "Member"}
                      />

                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {user?.name ?? "Unknown user"}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {user?.email ?? "No email"}
                      </p>
                    </div>

                    <div className="hidden sm:block">
                      <Badge variant="secondary" className="capitalize">
                        {member.role}
                      </Badge>
                    </div>

                    <p className="hidden w-24 text-right text-xs text-muted-foreground md:block">
                      {formatRelativeTime(member.createdAt)}
                    </p>

                    {canManageMember && (
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <button
                              type="button"
                              aria-label={`Actions for ${user?.name ?? "member"}`}
                              className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            />
                          }
                        >
                          <MoreHorizontal className="size-4" />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          align="end"
                          className="w-44 rounded-xl p-1.5"
                        >
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedMember(member);
                              setIsUpdateMemberRoleDialogOpen(true);
                            }}
                            className="cursor-pointer gap-2 rounded-lg px-2.5 py-2"
                          >
                            <Pencil className="h-4 w-4" />
                            <span>Change role</span>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator className="my-1.5" />

                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedMember(member);
                              setIsRemoveDialogOpen(true);
                            }}
                            variant="destructive"
                            className="cursor-pointer gap-2 rounded-lg px-2.5 py-2 whitespace-nowrap"
                          >
                            <Trash2 className="h-4 w-4 shrink-0" />
                            <span>Remove member</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                );
              })}
            </div>

            {pagination?.totalPages > 1 && (
              <div className="flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <p className="text-xs text-muted-foreground">
                    Page {pagination.page} of {pagination.totalPages}
                  </p>
                </div>

                <Pagination className="mx-0 w-auto sm:justify-end">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={handlePreviousPage}
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
                        <PaginationLink
                          href="#"
                          isActive={page === pageNumber}
                          onClick={(event) =>
                            handlePageChange(event, pageNumber)
                          }
                          className={
                            isFetching
                              ? "pointer-events-none cursor-default opacity-60"
                              : "cursor-pointer"
                          }
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={handleNextPage}
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

      <InviteMemberDialog
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        workspaceId={workspaceId}
      />

      <UpdateMemberRoleDialog
        open={isUpdateMemberRoleDialogOpen}
        onOpenChange={setIsUpdateMemberRoleDialogOpen}
        workspaceId={workspaceId}
        member={selectedMember}
      />

      <RemoveMemberDialog
        isRemoveDialogOpen={isRemoveDialogOpen}
        setIsRemoveDialogOpen={setIsRemoveDialogOpen}
        selectedMember={selectedMember}
        workspaceId={workspaceId}
      />
    </div>
  );
};

export default MembersPage;
