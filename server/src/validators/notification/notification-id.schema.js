import { z } from "zod";

import mongoose from "mongoose";

const notificationIdSchema = z.object({
  notificationId: z
    .string()
    .refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: "Invalid notification ID.",
    }),
});

export default notificationIdSchema;
