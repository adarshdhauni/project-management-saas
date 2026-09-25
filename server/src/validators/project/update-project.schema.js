import { z } from "zod";

const updateProjectSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Project name must be at least 3 characters.")
      .max(100, "Project name cannot exceed 100 characters.")
      .optional(),

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
      .nullable()
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
      .nullable()
      .optional(),
  })
  .strict()
  .refine(
    (data) =>
      data.name !== undefined ||
      data.description !== undefined ||
      data.color !== undefined ||
      data.icon !== undefined,
    {
      message: "At least one field must be provided.",
    },
  );

export default updateProjectSchema;
