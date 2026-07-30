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

  color: z.string().trim().optional(),

  icon: z.string().trim().optional(),
});

export default createProjectSchema;
