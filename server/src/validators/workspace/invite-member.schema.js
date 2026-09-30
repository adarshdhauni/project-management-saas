import { z } from "zod";

const inviteMemberSchema = z
  .object({
    email: z
      .email("Please provide a valid email address.")
      .trim()
      .toLowerCase(),

    role: z.enum(["admin", "member"]).default("member"),
  })
  .strict();

export default inviteMemberSchema;
