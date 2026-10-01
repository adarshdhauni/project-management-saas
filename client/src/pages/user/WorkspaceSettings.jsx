import { useEffect, useState } from "react";
import { Save, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  useGetWorkspaceByIdQuery,
  useUpdateWorkspaceMutation,
  useDeleteWorkspaceMutation,
  useGetMyWorkspaceMembershipQuery,
} from "@/features/workspace/workspaceApi";

const WorkspaceSettings = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isFetching, isError } = useGetWorkspaceByIdQuery(
    workspaceId,
    {
      skip: !workspaceId,
    },
  );

  const [updateWorkspace, { isLoading: isUpdating }] =
    useUpdateWorkspaceMutation();

  const [deleteWorkspace, { isLoading: isDeleting }] =
    useDeleteWorkspaceMutation();

  const { data: membershipData, isLoading: isMembershipLoading } =
    useGetMyWorkspaceMembershipQuery(workspaceId);

  const currentUserRole = membershipData?.data?.role;

  console.log(currentUserRole)

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const workspace = data?.data;

  useEffect(() => {
    if (!workspace) return;

    setName(workspace.name ?? "");
    setDescription(workspace.description ?? "");
  }, [workspace]);

  const handleUpdate = async (event) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      toast.add({
        type: "error",
        description: "Workspace name is required.",
        priority: "high",
      });
      return;
    }

    try {
      await updateWorkspace({
        workspaceId,
        data: {
          name: trimmedName,
          description: trimmedDescription,
        },
      }).unwrap();

      toast.add({
        type: "success",
        title: "Workspace updated",
        description: "Workspace settings were updated successfully.",
      });
    } catch (error) {
      toast.add({
        type: "error",
        title:
          error?.data?.message || "Something went wrong. Please try again.",
        priority: "high",
      });
    }
  };

  const handleDelete = async () => {
    if (!workspace?._id) return;

    try {
      await deleteWorkspace(workspace._id).unwrap();

      toast.add({
        type: "success",
        title: "Workspace deleted",
        description: `"${workspace.name}" was deleted successfully.`,
      });

      setIsDeleteDialogOpen(false);

      navigate("/dashboard");
    } catch (error) {
      toast.add({
        type: "error",
        title:
          error?.data?.message || "Something went wrong. Please try again.",
        priority: "high",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Header skeleton */}
        <div>
          <div className="h-5 w-36 animate-pulse rounded-md bg-muted" />
          <div className="mt-2 h-4 w-72 animate-pulse rounded-md bg-muted" />
        </div>

        {/* General skeleton */}
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-4 py-4 sm:px-5">
            <div className="h-4 w-16 animate-pulse rounded-md bg-muted" />
            <div className="mt-2 h-3 w-64 animate-pulse rounded-md bg-muted" />
          </div>

          <div className="space-y-5 px-4 py-5 sm:px-5">
            <div className="space-y-2">
              <div className="h-3 w-28 animate-pulse rounded-md bg-muted" />
              <div className="h-10 animate-pulse rounded-md bg-muted" />
              <div className="h-3 w-80 animate-pulse rounded-md bg-muted" />
            </div>

            <div className="space-y-2">
              <div className="h-3 w-20 animate-pulse rounded-md bg-muted" />
              <div className="h-24 animate-pulse rounded-md bg-muted" />
              <div className="h-3 w-72 animate-pulse rounded-md bg-muted" />
            </div>
          </div>

          <div className="flex justify-end border-t border-border px-4 py-3 sm:px-5">
            <div className="h-9 w-32 animate-pulse rounded-md bg-muted" />
          </div>
        </div>

        {/* Secondary card skeleton */}
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-4 py-4 sm:px-5">
            <div className="h-4 w-32 animate-pulse rounded-md bg-muted" />
            <div className="mt-2 h-3 w-64 animate-pulse rounded-md bg-muted" />
          </div>

          <div className="px-4 py-5 sm:px-5">
            <div className="h-9 w-36 animate-pulse rounded-md bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !workspace) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <h2 className="text-sm font-semibold text-foreground">
          Unable to load workspace settings
        </h2>

        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          We couldn't load this workspace. Please try again.
        </p>
      </div>
    );
  }

  const hasChanges =
    name.trim() !== (workspace.name ?? "") ||
    description.trim() !== (workspace.description ?? "");

  return (
    <>
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Header */}
        <div>
          <h1 className="text-lg font-semibold">Workspace settings</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your workspace information and configuration.
          </p>
        </div>

        {/* General */}
        <form onSubmit={handleUpdate}>
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-4 py-4 sm:px-5">
              <h2 className="text-sm font-semibold">General</h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Update the basic information for this workspace.
              </p>
            </div>

            <div className="space-y-5 px-4 py-5 sm:px-5">
              <Field data-disabled={isUpdating}>
                <FieldLabel htmlFor="workspace-name">Workspace name</FieldLabel>

                <Input
                  id="workspace-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  disabled={isUpdating}
                  maxLength={100}
                />

                <FieldDescription>
                  Choose a name that helps your team identify this workspace.
                </FieldDescription>
              </Field>

              <Field data-disabled={isUpdating}>
                <FieldLabel htmlFor="workspace-description">
                  Description
                </FieldLabel>

                <Textarea
                  id="workspace-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  disabled={isUpdating}
                  maxLength={500}
                  className="min-h-24 resize-none"
                />

                <FieldDescription>
                  A short description of what this workspace is used for.
                </FieldDescription>
              </Field>
            </div>

            <div className="flex justify-end border-t border-border px-4 py-3 sm:px-5">
              <Button
                type="submit"
                disabled={
                  isUpdating || isFetching || !hasChanges || !name.trim()
                }
                className="cursor-pointer"
              >
                {isUpdating ? (
                  <>
                    <Spinner data-icon="inline-start" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save data-icon="inline-start" />
                    Save changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Transfer Ownership — Owner Only */}
        {currentUserRole === "owner" && (
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-4 py-4 sm:px-5">
              <h2 className="text-sm font-semibold">Transfer ownership</h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Transfer ownership of this workspace to another member.
              </p>
            </div>

            <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div>
                <p className="text-sm font-medium">Change workspace owner</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  You will become an admin after transferring ownership.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => setIsTransferDialogOpen(true)}
                className="w-full cursor-pointer sm:w-auto"
              >
                Transfer ownership
              </Button>
            </div>
          </div>
        )}

        {/* Leave Workspace — Admin / Member */}
        {currentUserRole !== "owner" && (
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-4 py-4 sm:px-5">
              <h2 className="text-sm font-semibold">Leave workspace</h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Leave this workspace and lose access to its projects, tasks, and
                other data.
              </p>
            </div>

            <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div>
                <p className="text-sm font-medium">Leave workspace</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  You can only rejoin if another member invites you.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => setIsLeaveDialogOpen(true)}
                className="w-full cursor-pointer sm:w-auto"
              >
                Leave workspace
              </Button>
            </div>
          </div>
        )}

        {/* Danger Zone — Owner Only */}
        {currentUserRole === "owner" && (
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-4 py-4 sm:px-5">
              <h2 className="text-sm font-semibold text-destructive">
                Danger zone
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Permanently delete this workspace and all associated data.
              </p>
            </div>

            <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div>
                <p className="text-sm font-medium">Delete workspace</p>

                <p className="mt-1 text-xs text-muted-foreground">
                  This action cannot be undone.
                </p>
              </div>

              <Button
                type="button"
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="w-full cursor-pointer sm:w-auto"
              >
                <Trash2 data-icon="inline-start" />
                Delete workspace
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Workspace Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete workspace?</DialogTitle>

            <DialogDescription>
              This will permanently delete{" "}
              <span className="font-medium text-foreground">
                {workspace.name}
              </span>{" "}
              and all of its projects, tasks, members, comments, and other
              associated data. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
              className="cursor-pointer"
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="cursor-pointer"
            >
              {isDeleting ? (
                <>
                  <Spinner data-icon="inline-start" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 data-icon="inline-start" />
                  Delete workspace
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WorkspaceSettings;
