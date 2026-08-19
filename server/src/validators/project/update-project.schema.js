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

    color: z.string().trim().optional(),

    icon: z.string().trim().optional(),
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
