import ms from "ms";
import env from "../config/env.js";

export const accessTokenCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: ms(env.ACCESS_TOKEN_EXPIRES_IN),
};

export const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: ms(env.REFRESH_TOKEN_EXPIRES_IN),
};
