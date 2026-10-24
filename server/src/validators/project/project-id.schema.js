import mongoose from "mongoose";
import { z } from "zod";

const projectIdSchema = z.object({
  projectId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid project ID.",
  }),
});

export default projectIdSchema;
