import express from "express";
import { protect } from "../middlewares/protect.js";
import validate from "../middlewares/validate.js";
import taskController from "../controllers/task.controller.js";
import taskIdSchema from "../validators/task/task-id.schema.js";
import updateTaskSchema from "../validators/task/update-task.schema.js";
import moveTaskSchema from "../validators/task/move-task.schema.js";
import commentController from "../controllers/comment.controller.js";
import createCommentSchema from "../validators/comment/create-comment.schema.js";
import getCommentsSchema from "../validators/comment/get-comments.schema.js"

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

router.delete(
  "/:taskId",
  protect,
  validate({
    params: taskIdSchema,
  }),
  taskController.deleteTask,
);

router.patch(
  "/:taskId/position",
  protect,
  validate({
    params: taskIdSchema,
  }),
  validate({
    body: moveTaskSchema,
  }),
  taskController.moveTask,
);

router.post(
  "/:taskId/comments",
  protect,
  validate({
    params: taskIdSchema,
  }),
  validate({
    body: createCommentSchema,
  }),
  commentController.createComment,
);

router.get(
  "/:taskId/comments",
  protect,
  validate({
    params: taskIdSchema,
  }),
  validate({
    query: getCommentsSchema,
  }),
  commentController.getComments,
);

export default router;
