import { z } from "zod";
import mongoose from "mongoose";

const projectIdSchema = z.object({
  projectId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid project ID.",
  }),
});

export default projectIdSchema;
