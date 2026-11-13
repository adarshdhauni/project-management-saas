import { z } from "zod";

import { PASSWORD_REGEX } from "../../constants/regex.js";

const registerSchema = z.object({
  name: z.string().min(2).max(50).trim(),
  email: z.email().trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .max(64, "Password cannot exceed 64 characters.")
    .regex(
      PASSWORD_REGEX,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    ),
});

export default registerSchema;
