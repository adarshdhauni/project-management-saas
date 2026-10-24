import mongoose from "mongoose";
import { z } from "zod";

const invitationIdSchema = z.object({
  invitationId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid invitation ID.",
  }),
});

export default invitationIdSchema;
