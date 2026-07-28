import { z } from "zod";
import mongoose from "mongoose";

const workspaceIdSchema = z.object({
  workspaceId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid workspace ID.",
  }),
});

export default workspaceIdSchema;
