import { z } from "zod";

const workspaceMemberParamsSchema = z.object({
  role: z.enum(["admin", "member"]),
});

export default workspaceMemberParamsSchema;