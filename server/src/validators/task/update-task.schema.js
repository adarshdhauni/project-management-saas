import { z } from "zod";
import mongoose from "mongoose";

const updateTaskSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Task title must be at least 3 characters.")
      .max(200, "Task title cannot exceed 200 characters.")
      .optional(),

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
      .nullable()
      .optional(),

    dueDate: z.coerce.date().nullable().optional(),

    position: z.number().min(0).optional(),
  })
  .strict()
  .refine(
    (data) =>
      data.title !== undefined ||
      data.description !== undefined ||
      data.status !== undefined ||
      data.priority !== undefined ||
      data.assignee !== undefined ||
      data.dueDate !== undefined ||
      data.position !== undefined,
    {
      message: "At least one field must be provided.",
    },
  );

export default updateTaskSchema;
