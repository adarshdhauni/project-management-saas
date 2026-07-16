import { z } from "zod";
import { PASSWORD_REGEX } from "../../constants/regex.js";

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required."),
  password: z
    .string()
    .min(8)
    .regex(
      PASSWORD_REGEX,
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.",
    ),
});

export default resetPasswordSchema;
