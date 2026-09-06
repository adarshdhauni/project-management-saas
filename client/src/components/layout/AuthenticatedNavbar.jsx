import {
  Bell,
  ChevronDown,
  Search,
  Settings,
  User,
  LogOut,
  Plus,
  RefreshCw,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import ThemeToggle from "../common/ThemeToggle";
import { useGetWorkspacesQuery } from "@/features/workspace/workspaceApi";
import { Skeleton } from "../ui/skeleton";
import { useSelector } from "react-redux";
import { Spinner } from "../ui/spinner";

const AuthenticatedNavbar = () => {
  const user = useSelector((state) => state.auth.user);

  const initials = user?.name
    ?.split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const { data, isLoading, isFetching, isError, refetch } =
    useGetWorkspacesQuery();

  const workspaces = data?.data?.workspaces ?? [];

  return (
    <header className="h-16 border-b border-border bg-background">
      <div className="flex h-full items-center justify-between px-5 sm:px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-sm font-semibold">T</span>
            </div>

            <span className="text-[15px] font-semibold tracking-tight">
              TaskFlow
            </span>
          </Link>

          {isLoading ? (
            <div className="flex items-center gap-2 rounded-lg px-2.5 py-2">
              <Skeleton className="h-6 w-6 rounded-md" />
              <Skeleton className="hidden h-4 w-28 rounded sm:block" />
            </div>
          ) : isError ? (
            <button
              type="button"
              onClick={refetch}
              disabled={isFetching}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-destructive transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-50"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted">
                {isFetching ? (
                  <Spinner className="h-3.5 w-3.5" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
              </div>

              <span className="hidden sm:inline">
                {isFetching ? "Retrying..." : "Retry"}
              </span>
            </button>
          ) : workspaces.length === 0 ? (
            <button
              type="button"
              className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted">
                <Plus className="h-3.5 w-3.5" />
              </div>

              <span className="hidden sm:inline">Create workspace</span>
            </button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  />
                }
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-[11px] font-semibold text-foreground/70">
                  {workspaceInitials}
                </div>

                <span className="hidden sm:inline">
                  {currentWorkspace?.name}
                </span>

                <ChevronDown className="h-3.5 w-3.5" />
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="start"
                className="w-64 rounded-xl p-1.5"
              ></DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Search className="h-4 w-4" />

            <span className="hidden sm:inline">Search</span>

            <kbd className="ml-2 hidden rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground md:inline">
              ⌘ K
            </kbd>
          </button>

          <ThemeToggle />

          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
          </button>

          <div className="mx-2 h-6 w-px bg-border" />

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg p-1.5 pr-2 transition-colors hover:bg-muted"
                />
              }
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {initials}
              </div>

              <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:block" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 rounded-xl p-1.5">
              <div className="px-2.5 py-2">
                <p className="text-sm font-medium">{user?.name}</p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  {user?.email}
                </p>
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="gap-2 rounded-lg">
                <User className="h-4 w-4" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem className="gap-2 rounded-lg">
                <Settings className="h-4 w-4" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem className="gap-2 rounded-lg text-destructive focus:text-destructive">
                <LogOut className="h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AuthenticatedNavbar;
