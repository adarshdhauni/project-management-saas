import { z } from "zod";

const inviteMemberSchema = z
  .object({
    email: z
      .email("Please provide a valid email address.")
      .trim()
      .toLowerCase(),

    role: z.enum(["admin", "member"]).optional(),
  })
  .strict();

export default inviteMemberSchema;
