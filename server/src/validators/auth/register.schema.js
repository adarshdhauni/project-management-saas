import { email, z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2).max(50).trim(),
  email: z.string().trim().toLowerCase().email(),
  password: z.string(),
});

export default registerSchema;
