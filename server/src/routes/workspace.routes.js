import express from "express";

import workspaceController from "../controllers/workspace.controller.js";
import { protect } from "../middlewares/protect.js";
import validate from "../middlewares/validate.js";
import createWorkspaceSchema from "../validators/workspace/create-workspace.schema.js";

const router = express.Router();

router.post(
  "/",
  protect,
  validate({ body: createWorkspaceSchema }),
  workspaceController.createWorkspace,
);

export default router;
