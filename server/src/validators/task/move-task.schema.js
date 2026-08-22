import { z } from "zod";
import mongoose from "mongoose";

const moveTaskSchema = z
  .object({
    beforeTaskId: z
      .string()
      .refine((id) => mongoose.Types.ObjectId.isValid(id), {
        message: "Invalid target task ID.",
      })
      .nullable(),
  })
  .strict();

export default moveTaskSchema;
