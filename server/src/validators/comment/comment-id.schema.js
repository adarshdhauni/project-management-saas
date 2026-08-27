import { z } from "zod";
import mongoose from "mongoose";

const commentIdSchema = z.object({
  commentId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid comment ID.",
  }),
});

export default commentIdSchema;
