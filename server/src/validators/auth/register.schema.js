import { z } from "zod";
import { PASSWORD_REGEX } from "../../constants/regex.js";

const registerSchema = z.object({
  name: z.string().min(2).max(50).trim(),
  email: z.email().trim().toLowerCase(),
  password: z
    .string()
    .min(8)
    .max(64)
    .regex(
      PASSWORD_REGEX,
      "Password must be 8 to 64 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    ),
});

export default registerSchema;
