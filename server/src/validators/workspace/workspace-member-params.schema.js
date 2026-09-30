import { z } from "zod";
import mongoose from "mongoose";

const workspaceMemberParamsSchema = z.object({
  workspaceId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid workspace ID.",
  }),

  memberId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid member ID.",
  }),
});

export default workspaceMemberParamsSchema;
