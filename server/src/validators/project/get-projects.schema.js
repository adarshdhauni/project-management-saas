import { z } from "zod";

const getProjectsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().max(100).default(""),
  archived: z.enum(["true", "false"]).optional(),
});

export default getProjectsSchema;
