import { useEffect, useState } from "react";
import { Crown, Search, Users } from "lucide-react";

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
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "@/components/ui/toast";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";

import {
  useGetWorkspaceMembersQuery,
  useTransferOwnershipMutation,
} from "../workspaceApi";

const TransferOwnership = ({ open, onOpenChange, workspace }) => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMember, setSelectedMember] = useState(null);

  const limit = 20;

  const { data, isLoading, isError, isFetching } = useGetWorkspaceMembersQuery(
    {
      workspaceId: workspace?._id,
      page,
      limit,
      search: search.trim(),
    },
    {
      skip: !open || !workspace?._id,
    },
  );

  const [transferOwnership, { isLoading: isTransferring }] =
    useTransferOwnershipMutation();

  const members = data?.data?.members ?? [];
  const pagination = data?.data?.pagination;

  // The owner should never appear as a selectable target.
  const transferableMembers = members.filter(
    (member) => member.role !== "owner",
  );

  useEffect(() => {
    if (!open) {
      setSearch("");
      setPage(1);
      setSelectedMember(null);
    }
  }, [open]);

  useEffect(() => {
    setPage(1);
    setSelectedMember(null);
  }, [search]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handlePageChange = (event, pageNumber) => {
    event.preventDefault();

    if (page === pageNumber || isFetching) return;

    setPage(pageNumber);
    setSelectedMember(null);
  };

  const handlePreviousPage = (event) => {
    event.preventDefault();

    if (!pagination?.hasPreviousPage || isFetching) return;

    setPage((currentPage) => currentPage - 1);
    setSelectedMember(null);
  };

  const handleNextPage = (event) => {
    event.preventDefault();

    if (!pagination?.hasNextPage || isFetching) return;

    setPage((currentPage) => currentPage + 1);
    setSelectedMember(null);
  };

  const handleTransferOwnership = async () => {
    if (!workspace?._id || !selectedMember?._id) return;

    try {
      await transferOwnership({
        workspaceId: workspace._id,
        data: {
          memberId: selectedMember._id,
        },
      }).unwrap();

      toast.add({
        type: "success",
        title: "Ownership transferred",
        description: `"${selectedMember.user?.name ?? "The selected member"}" is now the workspace owner.`,
      });

      onOpenChange(false);
    } catch (error) {
      toast.add({
        type: "error",
        title:
          error?.data?.message || "Something went wrong. Please try again.",
        priority: "high",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Transfer ownership?</DialogTitle>

          <DialogDescription>
            Transfer ownership of{" "}
            <span className="font-medium text-foreground">
              {workspace?.name}
            </span>{" "}
            to another member. You will become an admin after the transfer.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <Field data-disabled={isTransferring}>
            <FieldLabel>New owner</FieldLabel>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                type="search"
                placeholder="Search members..."
                value={search}
                onChange={handleSearchChange}
                disabled={isTransferring}
                className="pl-9"
              />
            </div>

            <FieldDescription>
              Select the member who should become the new workspace owner.
            </FieldDescription>
          </Field>

          <div className="rounded-xl border border-border">
            {isLoading ? (
              <div className="divide-y divide-border">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 px-3 py-3 sm:px-4"
                  >
                    <Skeleton className="h-9 w-9 shrink-0 rounded-full" />

                    <div className="min-w-0 flex-1 space-y-2">
                      <Skeleton className="h-3.5 w-32 rounded-md" />
                      <Skeleton className="h-3 w-40 rounded-md" />
                    </div>

                    <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>

                <p className="mt-4 text-sm font-medium">
                  Couldn't load members
                </p>

                <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                  We couldn't load the workspace members. Please close the
                  dialog and try again.
                </p>
              </div>
            ) : transferableMembers.length === 0 && !isFetching ? (
              <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>

                <p className="mt-4 text-sm font-medium">
                  {search.trim() ? "No members found" : "No other members"}
                </p>

                <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                  {search.trim()
                    ? `No members match "${search.trim()}".`
                    : "Invite another member before transferring ownership."}
                </p>
              </div>
            ) : (
              <>
                <div className="divide-y divide-border">
                  {transferableMembers.map((member) => {
                    const user = member.user;

                    const initials =
                      user?.name
                        ?.split(" ")
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase() ?? "?";

                    const isSelected = selectedMember?._id === member._id;

                    return (
                      <button
                        key={member._id}
                        type="button"
                        onClick={() => setSelectedMember(member)}
                        disabled={isTransferring || isFetching}
                        className={`flex w-full items-center gap-3 px-3 py-3 text-left transition-colors sm:px-4 ${
                          isSelected ? "bg-muted" : "hover:bg-muted/60"
                        } ${
                          isTransferring || isFetching
                            ? "cursor-default"
                            : "cursor-pointer"
                        }`}
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

                        <div
                          className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${
                            isSelected
                              ? "border-primary bg-primary"
                              : "border-border"
                          }`}
                        >
                          {isSelected && (
                            <div className="size-2 rounded-full bg-primary-foreground" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {pagination?.totalPages > 1 && (
                  <div className="flex flex-col gap-4 border-t border-border px-3 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-4">
                    <p className="text-xs text-muted-foreground">
                      Page {pagination.page} of {pagination.totalPages}
                    </p>

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
          </div>

          {selectedMember && (
            <div className="rounded-xl border border-border bg-muted/40 px-3 py-3">
              <div className="flex items-start gap-3">
                <Crown className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    Transfer ownership to{" "}
                    {selectedMember.user?.name ?? "this member"}?
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    You will become an admin and they will become the workspace
                    owner.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isTransferring}
            className="cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleTransferOwnership}
            disabled={
              isTransferring ||
              isLoading ||
              isFetching ||
              isError ||
              !selectedMember
            }
            className="cursor-pointer"
          >
            {isTransferring ? (
              <>
                <Spinner data-icon="inline-start" />
                Transferring...
              </>
            ) : (
              <>
                <Crown data-icon="inline-start" />
                Transfer ownership
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransferOwnership;
