import { z } from "zod";
import mongoose from "mongoose";

const taskIdSchema = z.object({
  taskId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid task ID.",
  }),
});

export default taskIdSchema;
