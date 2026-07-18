import { z } from "zod";

export const updateWorkspaceSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(3, "Workspace name must be at least 3 characters.")
        .max(100, "Workspace name cannot exceed 100 characters.")
        .optional(),

      description: z
        .string()
        .trim()
        .max(500, "Description cannot exceed 500 characters.")
        .optional(),
      logo: z.string().trim().url().optional(),
    })
    .strict()
    .refine(
      (data) =>
        data.name !== undefined ||
        data.description !== undefined ||
        data.logo !== undefined,
      {
        message: "At least one field must be provided.",
      },
    ),
});
