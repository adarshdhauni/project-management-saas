import { z } from "zod";

import { z } from "zod";

const getNotificationsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(20),

  read: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => (value === undefined ? undefined : value === "true")),
});

export default getNotificationsSchema;

const notificationIdSchema = z.object({
  params: z.object({
    notificationId: z.string().regex(/^[a-f\d]{24}$/i, {
      message: "Invalid notification ID.",
    }),
  }),
});
