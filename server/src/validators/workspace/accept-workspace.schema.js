import { z } from "zod";
import mongoose from "mongoose";

const acceptInvitationSchema = z.object({
  invitationId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "Invalid invitation ID.",
  }),
});

export default acceptInvitationSchema;
