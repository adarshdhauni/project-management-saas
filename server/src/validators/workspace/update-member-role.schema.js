import { z } from "zod";

const updateMemberRoleSchema = z.object({
  role: z.enum(["admin", "member"]).default("member"),
});

export default updateMemberRoleSchema;
