import {
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  CheckSquare,
  Code2,
  FolderKanban,
  Globe,
  LayoutDashboard,
  MessageSquare,
  Rocket,
  ShoppingBag,
  Smartphone,
  Users,
} from "lucide-react";

export const projectIcons = [
  { value: "folder-kanban", label: "Folder", icon: FolderKanban },
  { value: "layout-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { value: "check-square", label: "Tasks", icon: CheckSquare },
  { value: "code", label: "Development", icon: Code2 },
  { value: "rocket", label: "Launch", icon: Rocket },
  { value: "briefcase", label: "Business", icon: BriefcaseBusiness },
  { value: "shopping-bag", label: "Shopping", icon: ShoppingBag },
  { value: "calendar", label: "Calendar", icon: CalendarDays },
  { value: "users", label: "Team", icon: Users },
  { value: "message-square", label: "Communication", icon: MessageSquare },
  { value: "bar-chart", label: "Analytics", icon: BarChart3 },
  { value: "globe", label: "Website", icon: Globe },
  { value: "smartphone", label: "Mobile", icon: Smartphone },
];

export const projectColors = [
  { value: "blue", label: "Blue", className: "bg-blue-500" },
  { value: "green", label: "Green", className: "bg-green-500" },
  { value: "yellow", label: "Yellow", className: "bg-yellow-500" },
  { value: "orange", label: "Orange", className: "bg-orange-500" },
  { value: "red", label: "Red", className: "bg-red-500" },
  { value: "purple", label: "Purple", className: "bg-purple-500" },
  { value: "pink", label: "Pink", className: "bg-pink-500" },
  { value: "cyan", label: "Cyan", className: "bg-cyan-500" },
];
