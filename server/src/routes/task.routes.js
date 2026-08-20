import express from "express";
import { protect } from "../middlewares/protect.js";
import validate from "../middlewares/validate.js";
import taskController from "../controllers/task.controller.js";
import taskIdSchema from "../validators/task/task-id.schema.js";
import updateTaskSchema from "../validators/task/update-task.schema.js";

const router = express.Router();

router.get(
  "/:taskId",
  protect,
  validate({
    params: taskIdSchema,
  }),
  taskController.getTaskById,
);

router.patch(
  "/:taskId",
  protect,
  validate({
    params: taskIdSchema,
  }),
  validate({
    body: updateTaskSchema,
  }),
  taskController.updateTask,
);

export default router;
