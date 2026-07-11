import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimiter from "./middlewares/rateLimiter";
import env from "./config/env";
import morgan from "morgan";
import ApiError from "./utils/ApirError";
import errorHandler from "./middlewares/errorHandler";

const app = express();

app.set("trust proxy", 1);

app.use(helmet());

const allowedOrigins = [env.CLIENT_URL, "http://localhost:5173"];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(compression());

app.use(express.json({ limit: "10kb" }));

app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(cookieParser());

if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(rateLimit);

app.use((req, res, next) => {
  throw new ApiError("Invalid route, please try again!");
});

app.use(errorHandler);

export default app;
