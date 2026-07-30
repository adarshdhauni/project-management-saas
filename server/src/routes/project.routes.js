import express from "express";
import projectController from "../controllers/project.controller.js";
import { protect } from "../middlewares/protect.js";
import validate from "../middlewares/validate.js";
import projectIdSchema from "../validators/project/project-id.schema.js";

const router = express.Router();

router.get(
  "/:projectId",
  protect,
  validate({
    params: projectIdSchema,
  }),
  projectController.getProjectById,
);

export default router;
