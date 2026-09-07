import {
  Bell,
  ChevronDown,
  Search,
  Settings,
  User,
  LogOut,
  LayoutDashboard,
  Check,
  Plus,
  RefreshCw,
  Building2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useGetWorkspacesQuery } from "@/features/workspace/workspaceApi";

import ThemeToggle from "../common/ThemeToggle";
import { Skeleton } from "../ui/skeleton";
import { Spinner } from "../ui/spinner";
import { useState } from "react";
import CreateWorkspaceDialog from "@/features/workspace/components/CreateWorkspaceDialog";
import { useLogoutMutation } from "@/features/auth/authApi";
import { clearCredentials } from "@/features/auth/authSlice";
import { toast } from "../ui/toast";

const AuthenticatedNavbar = () => {
  const user = useSelector((state) => state.auth.user);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isCreateWorkspaceOpen, setIsCreateWorkspaceOpen] = useState(false);

  const { data, isLoading, isFetching, isError, refetch } =
    useGetWorkspacesQuery();

  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const workspaces = data?.data ?? [];

  const workspaceId = location.pathname.match(
    /^\/dashboard\/workspaces\/([^/]+)/,
  )?.[1];

  const isWorkspaceRoute = Boolean(workspaceId);

  const currentWorkspace = workspaces.find(
    (workspace) => workspace._id === workspaceId,
  );

  const initials = user?.name
    ?.split(/\s+/)
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const workspaceInitials = currentWorkspace?.name
    ?.split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleWorkspaceSelect = (id) => {
    navigate(`/dashboard/workspaces/${id}`);
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();

      dispatch(clearCredentials());

      navigate("/auth/login", { replace: true });
    } catch (error) {
      toast.add({
        type: "error",
        title: err?.data?.message || "Failed to log out. Please try again.",
        priority: "high",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border bg-background/85 text-foreground backdrop-blur-xl">
      <div className="flex h-full items-center justify-between gap-2 px-3 sm:px-5 lg:px-6">
        <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          <Link to="/" className="flex shrink-0 items-center gap-2 rounded-lg">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-sm font-semibold">T</span>
            </div>

            <span className="hidden text-[15px] font-semibold tracking-tight sm:inline">
              TaskFlow
            </span>
          </Link>

          <div className="mx-0.5 hidden h-6 w-px bg-border sm:block" />
          {isWorkspaceRoute && (
            <Link
              to="/dashboard"
              aria-label="Dashboard"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:h-10 sm:w-auto sm:gap-2 sm:px-2.5"
            >
              <LayoutDashboard className="h-4 w-4" />

              <span className="hidden text-sm sm:inline">Dashboard</span>
            </Link>
          )}

          {isLoading ? (
            <Skeleton className="h-9 w-32 rounded-lg sm:h-10 sm:w-44" />
          ) : isError ? (
            <button
              type="button"
              onClick={refetch}
              disabled={isFetching}
              aria-label={isFetching ? "Retrying" : "Retry"}
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-destructive transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50 sm:h-10 sm:w-auto sm:gap-2 sm:px-2.5"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted">
                {isFetching ? (
                  <Spinner className="h-3.5 w-3.5" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
              </div>

              <span className="hidden text-sm sm:inline">
                {isFetching ? "Retrying..." : "Retry"}
              </span>
            </button>
          ) : workspaces.length === 0 ? (
            <button
              type="button"
              onClick={() => setIsCreateWorkspaceOpen(true)}
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:h-10 sm:w-auto sm:gap-2 sm:px-2.5"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted">
                <Plus className="h-3.5 w-3.5" />
              </div>

              <span className="hidden text-sm sm:inline">Create workspace</span>
            </button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    aria-label={`Current workspace: ${
                      currentWorkspace?.name ?? "Workspace"
                    }`}
                    className="flex h-9 min-w-0 max-w-36 shrink cursor-pointer items-center gap-2 rounded-lg px-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:h-10 sm:max-w-56 sm:px-2.5"
                  />
                }
              >
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted text-foreground/70">
                  {currentWorkspace ? (
                    workspaceInitials
                  ) : (
                    <Building2 className="h-3.5 w-3.5" />
                  )}
                </div>

                <span className="hidden truncate sm:block">
                  {currentWorkspace?.name ?? "Select workspace"}
                </span>

                <ChevronDown className="ml-auto h-3.5 w-3.5 shrink-0" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                className="max-h-80 w-[calc(100vw-1.5rem)] max-w-64 overflow-y-auto rounded-xl p-1.5 sm:w-64"
              >
                {workspaces.map((workspace) => {
                  const initials = workspace.name
                    .split(/\s+/)
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  const isActive = workspace._id === currentWorkspace?._id;

                  return (
                    <DropdownMenuItem
                      key={workspace._id}
                      onClick={() => handleWorkspaceSelect(workspace._id)}
                      className="cursor-pointer gap-2 rounded-lg px-2.5 py-2"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-[11px] font-semibold text-foreground/70">
                        {initials}
                      </div>

                      <span className="min-w-0 truncate">{workspace.name}</span>

                      {isActive && (
                        <Check className="ml-auto h-4 w-4 shrink-0 text-foreground" />
                      )}
                    </DropdownMenuItem>
                  );
                })}

                <DropdownMenuSeparator className="my-1.5" />

                <DropdownMenuItem
                  onClick={() => setIsCreateWorkspaceOpen(true)}
                  className="cursor-pointer gap-2 rounded-lg px-2.5 py-2"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Plus className="h-3.5 w-3.5" />
                  </div>

                  <span>Create workspace</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1.5">
          <button
            type="button"
            aria-label="Search"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:h-9 sm:w-auto sm:gap-2 sm:border sm:border-border sm:bg-muted/40 sm:px-3"
          >
            <Search className="h-4 w-4" />

            <span className="hidden text-sm sm:inline">Search</span>

            <kbd className="ml-2 hidden rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground lg:inline">
              ⌘ K
            </kbd>
          </button>

          <ThemeToggle />

          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Bell className="h-4 w-4" />

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
          </button>

          <div className="mx-1 h-6 w-px bg-border sm:mx-2" />

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="flex cursor-pointer items-center gap-1 rounded-lg p-1 transition-colors hover:bg-muted sm:gap-2 sm:p-1.5 sm:pr-2"
                />
              }
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {initials}
              </div>

              <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-[calc(100vw-1.5rem)] max-w-56 rounded-xl p-1.5"
            >
              <div className="px-2.5 py-2">
                <p className="truncate text-sm font-medium">{user?.name}</p>

                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {user?.email}
                </p>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg">
                <User className="h-4 w-4" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg">
                <Settings className="h-4 w-4" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="cursor-pointer gap-2 rounded-lg text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                {isLoggingOut ? "Logging out..." : "Log out"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CreateWorkspaceDialog
        open={isCreateWorkspaceOpen}
        onOpenChange={setIsCreateWorkspaceOpen}
      />
    </header>
  );
};

export default AuthenticatedNavbar;
