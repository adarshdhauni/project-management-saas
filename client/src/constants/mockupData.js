import {
  FolderKanban,
  Users,
  Settings,
  CheckSquare,
  ShoppingBag,
  Globe,
} from "lucide-react";

export const stats = [
  {
    label: "Projects",
    value: "3",
    description: "Active projects",
    icon: FolderKanban,
  },
  {
    label: "Tasks",
    value: "0",
    description: "Tasks across projects",
    icon: CheckSquare,
  },
  {
    label: "Members",
    value: "1",
    description: "Workspace members",
    icon: Users,
  },
];

export const recentProjects = [
  {
    name: "TaskFlow",
    description: "Project management platform",
    updated: "Updated 2 hours ago",
    icon: FolderKanban,
  },
  {
    name: "Nova Commerce",
    description: "E-commerce experience",
    updated: "Updated yesterday",
    icon: ShoppingBag,
  },
  {
    name: "Marketing Website",
    description: "Landing page redesign",
    updated: "Updated 3 days ago",
    icon: Globe,
  },
];

export const recentActivities = [
  {
    user: "Jim  Matthews",
    action: "created the project",
    target: "Taskflow",
    time: "2 hours ago",
    icon: FolderKanban,
  },
  {
    user: "Sarah  Williams",
    action: "created the project",
    target: "Nova Commerce",
    time: "Yesterday",
    icon: FolderKanban,
  },
  {
    user: "Adarsh Dhauni",
    action: "created the project",
    target: "Marketing Website",
    time: "3 days ago",
    icon: FolderKanban,
  },
  {
    user: "Adarsh Dhauni",
    action: "created the workspace",
    target: "Acme Workspace",
    time: "3 days ago",
    icon: Settings,
  },
];
