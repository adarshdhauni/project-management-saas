import {
  Bell,
  ChevronDown,
  Search,
  Settings,
  User,
  LogOut,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  return (
    <header className="h-16 border-b border-black/8 bg-white">
      <div className="h-full flex items-center justify-between px-6">
        {/* Left */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white">
              <span className="text-sm font-semibold">T</span>
            </div>

            <span className="text-[15px] font-semibold tracking-tight">
              TaskFlow
            </span>
          </div>

          {/* Workspace */}
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-black/65 transition-colors hover:bg-black/4 hover:text-black"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-black/6 text-[11px] font-semibold text-black/70">
              A
            </div>

            <span>Adarsh's Workspace</span>

            <ChevronDown className="h-3.5 w-3.5 text-black/40" />
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-lg border border-black/8 bg-black/2 px-3 text-sm text-black/40 transition-colors hover:border-black/15 hover:bg-black/4 hover:text-black/65"
          >
            <Search className="h-4 w-4" />

            <span className="hidden sm:inline">Search</span>

            <kbd className="ml-3 hidden rounded border border-black/10 bg-white px-1.5 py-0.5 text-[10px] font-medium text-black/35 md:inline">
              ⌘ K
            </kbd>
          </button>

          {/* Notifications */}
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-black/50 transition-colors hover:bg-black/5 hover:text-black"
            aria-label="Notifications"
          >
            <Bell className="h-4.5 w-4.5" />

            {/* Notification indicator */}
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-black" />
          </button>

          {/* Divider */}
          <div className="mx-2 h-6 w-px bg-black/8" />

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg p-1.5 pr-2 transition-colors hover:bg-black/5"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-medium text-white">
                  A
                </div>

                <ChevronDown className="h-3.5 w-3.5 text-black/40" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 rounded-xl p-1.5">
              <div className="px-2.5 py-2">
                <p className="text-sm font-medium">Adarsh</p>
                <p className="mt-0.5 text-xs text-black/45">
                  adarsh@example.com
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

              <DropdownMenuItem className="gap-2 rounded-lg">
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

export default Navbar;
