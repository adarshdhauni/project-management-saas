import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

export default forgotPasswordSchema;
