import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import WorkspaceNavItems from "./WorkspaceNavItems";

const MobileWorkspaceSidebar = () => {
  return (
    <div className="border-b border-border sm:hidden ">
      <Sheet>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open workspace navigation"
            />
          }
        >
          <Menu className="size-5" />
        </SheetTrigger>

        <SheetContent side="left" className="w-full max-w-sm p-0">
          <SheetTitle className="sr-only">Workspace navigation</SheetTitle>

          <SheetDescription className="sr-only">
            Navigate this workspace.
          </SheetDescription>

          <div className="flex h-full flex-col">
            <div className="border-b border-border px-6 py-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Workspace
              </p>

              <h2 className="mt-2 text-sm font-semibold tracking-tight">
                Workspace navigation
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Manage your projects, tasks, members, and workspace settings.
              </p>
            </div>

            <div className="px-4 py-6">
              <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Navigate
              </p>

              <WorkspaceNavItems />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileWorkspaceSidebar;
