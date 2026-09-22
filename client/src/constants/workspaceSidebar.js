import {
  Activity,
  CheckSquare,
  FolderKanban,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";

export const navItems = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    getTo: (workspaceId) => `/dashboard/workspaces/${workspaceId}`,
    end: true,
  },
  {
    label: "Projects",
    icon: FolderKanban,
    getTo: (workspaceId) => `/dashboard/workspaces/${workspaceId}/projects`,
  },
  {
    label: "Tasks",
    icon: CheckSquare,
    getTo: (workspaceId) => `/dashboard/workspaces/${workspaceId}/tasks`,
  },
  {
    label: "Activity",
    icon: Activity,
    getTo: (workspaceId) => `/dashboard/workspaces/${workspaceId}/activity`,
  },
  {
    label: "Members",
    icon: Users,
    getTo: (workspaceId) => `/dashboard/workspaces/${workspaceId}/members`,
  },
  {
    label: "Settings",
    icon: Settings,
    getTo: (workspaceId) => `/dashboard/workspaces/${workspaceId}/settings`,
  },
];
