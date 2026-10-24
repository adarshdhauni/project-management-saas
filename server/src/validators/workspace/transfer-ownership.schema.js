import mongoose from "mongoose";
import { z } from "zod";

const transferOwnershipSchema = z
  .object({
    memberId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: "Invalid member ID.",
    }),
  })
  .strict();

export default transferOwnershipSchema;
