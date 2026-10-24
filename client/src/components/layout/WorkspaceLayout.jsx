import { Outlet } from "react-router-dom";

import MobileWorkspaceSidebar from "./MobileWorkspaceSidebar";
import WorkspaceSidebar from "./WorkspaceSidebar";

export const WorkspaceLayout = () => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <WorkspaceSidebar />

      <div className="min-w-0 flex-1">
        <MobileWorkspaceSidebar />

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

