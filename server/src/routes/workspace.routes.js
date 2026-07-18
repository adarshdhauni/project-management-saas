import express from "express";
import createWorkspaceSchema from "../validators/workspace/create-workspace.schema";
import authController from "../controllers/workspace.controller";

const router = express.Router();

router.post(
  "/workspaces",
  validate({ body: createWorkspaceSchema }),
  authController.createWorkspace,
);
