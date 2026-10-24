import mongoose from "mongoose";
import { z } from "zod";

const workspaceIdSchema = z.object({
  workspaceId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid workspace ID.",
  }),
});

export default workspaceIdSchema;
