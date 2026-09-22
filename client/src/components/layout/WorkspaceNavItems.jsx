import { NavLink, useParams } from "react-router-dom";
import { navItems } from "@/constants/workspaceSidebar";

const WorkspaceNavItems = ({ onNavigate }) => {
  const { workspaceId } = useParams();

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.label}
            to={item.getTo(workspaceId)}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              }`
            }
          >
            <Icon className="size-4 shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default WorkspaceNavItems;
