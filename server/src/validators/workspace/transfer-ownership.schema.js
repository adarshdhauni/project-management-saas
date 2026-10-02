import { z } from "zod";
import mongoose from "mongoose";

const transferOwnershipSchema = z
  .object({
    memberId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: "Invalid member ID.",
    }),
  })
  .strict();

export default transferOwnershipSchema;
