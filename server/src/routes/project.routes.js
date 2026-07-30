import express from "express";
import workspaceIdSchema from "../validators/workspace/workspace-id.schema.js";
import createProjectSchema from "../validators/project/create-project.schema.js";
import projectController from "../controllers/project.controller.js";
import { protect } from "../middlewares/protect.js";

const router = express.Router();

export default router;
