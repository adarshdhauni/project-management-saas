import express from "express";
import projectController from "../controllers/project.controller.js";
import { protect } from "../middlewares/protect.js";
import validate from "../middlewares/validate.js";
import projectIdSchema from "../validators/project/project-id.schema.js";
import updateProjectSchema from "../validators/project/update-project.schema.js";

const router = express.Router();

router.get(
  "/:projectId",
  protect,
  validate({
    params: projectIdSchema,
  }),
  projectController.getProjectById,
);

router.patch(
  "/:projectId",
  protect,
  validate({
    params: projectIdSchema,
  }),
  validate({
    body: updateProjectSchema,
  }),
  projectController.updateProject,
);

router.delete(
  "/:projectId",
  protect,
  validate({
    params: projectIdSchema,
  }),
  projectController.deleteProject,
);

export default router;
