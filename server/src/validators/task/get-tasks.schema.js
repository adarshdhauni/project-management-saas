import { z } from "zod";
import mongoose from "mongoose";

const getTasksSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(20),

  status: z.enum(["todo", "in_progress", "in_review", "done"]).optional(),

  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),

  assignee: z
    .string()
    .refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: "Invalid assignee ID.",
    })
    .optional(),

  search: z.string().trim().min(1).max(100).optional(),

  sortBy: z
    .enum(["position", "createdAt", "dueDate", "priority", "title"])
    .default("position"),

  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export default getTasksSchema;
