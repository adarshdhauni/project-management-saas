import WorkspaceNavItems from "./WorkspaceNavItems";

const WorkspaceSidebar = () => {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-card sm:block">
      <div className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col">
        <nav className="flex-1 space-y-1 p-4">
          <WorkspaceNavItems />
        </nav>
      </div>
    </aside>
  );
};

export default WorkspaceSidebar;
