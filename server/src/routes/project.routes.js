import express from "express";
import projectController from "../controllers/project.controller.js";
import { protect } from "../middlewares/protect.js";
import validate from "../middlewares/validate.js";
import projectIdSchema from "../validators/project/project-id.schema.js";
import updateProjectSchema from "../validators/project/update-project.schema.js";
import createTaskSchema from "../validators/task/create-task.schema.js";
import taskController from "../controllers/task.controller.js";
import getTasksSchema from "../validators/task/get-tasks.schema.js";

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

router.post(
  "/:projectId/tasks",
  protect,
  validate({
    params: projectIdSchema,
  }),
  validate({
    body: createTaskSchema,
  }),
  taskController.createTask,
);

router.get(
  "/:projectId/tasks",
  protect,
  validate({
    params: projectIdSchema,
  }),
  validate({
    query: getTasksSchema,
  }),
  taskController.getTasks,
);

export default router;
