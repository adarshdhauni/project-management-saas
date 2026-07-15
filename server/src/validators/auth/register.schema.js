import { z } from "zod";
import { PASSWORD_REGEX } from "../../constants/regex";

const registerSchema = z.object({
  name: z.string().min(2).max(50).trim(),
  email: z.string().trim().toLowerCase().email(),
  password: z
    .string()
    .min(8)
    .regex(
      PASSWORD_REGEX,
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.",
    ),
});

export default registerSchema;
