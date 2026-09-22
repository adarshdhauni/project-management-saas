import { z } from "zod";

const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Project name must be at least 3 characters.")
    .max(100, "Project name cannot exceed 100 characters."),

  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters.")
    .optional(),

  color: z
    .enum([
      "blue",
      "green",
      "yellow",
      "orange",
      "red",
      "purple",
      "pink",
      "cyan",
    ])
    .optional(),

  icon: z
    .enum([
      "folder-kanban",
      "layout-dashboard",
      "check-square",
      "code",
      "rocket",
      "briefcase",
      "shopping-bag",
      "calendar",
      "users",
      "message-square",
      "bar-chart",
      "globe",
      "smartphone",
    ])
    .optional(),
});

export default createProjectSchema;
