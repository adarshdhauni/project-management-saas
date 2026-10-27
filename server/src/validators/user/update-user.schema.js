import { z } from "zod";

const updateUserSchema = z
  .object({
    name: z.string().trim().min(2).max(50).optional(),
    email: z.email().trim().toLowerCase().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided.",
  });

export default updateUserSchema;
