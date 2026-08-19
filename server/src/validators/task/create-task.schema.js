import { z } from "zod";
import mongoose from "mongoose";

const createTaskSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Task title must be at least 3 characters.")
      .max(200, "Task title cannot exceed 200 characters."),

    description: z
      .string()
      .trim()
      .max(5000, "Description cannot exceed 5000 characters.")
      .optional(),

    status: z.enum(["todo", "in_progress", "in_review", "done"]).optional(),

    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),

    assignee: z
      .string()
      .refine((id) => mongoose.Types.ObjectId.isValid(id), {
        message: "Invalid assignee ID.",
      })
      .optional(),

    dueDate: z.coerce.date().optional(),
  })
  .strict();

export default createTaskSchema;
