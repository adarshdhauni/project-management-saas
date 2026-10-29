import express from "express";

import commentController from "../controllers/comment.controller.js";
import { protect } from "../middlewares/protect.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import commentIdSchema from "../validators/comment/comment-id.schema.js";
import updateCommentSchema from "../validators/comment/update-comment.schema.js";

const router = express.Router();

router.get(
  "/:commentId",
  protect,
  validate({
    params: commentIdSchema,
  }),
  commentController.getCommentById,
);

router.patch(
  "/:commentId",
  protect,
  validate({
    params: commentIdSchema,
  }),
  validate({
    body: updateCommentSchema,
  }),
  commentController.updateComment,
);

router.delete(
  "/:commentId",
  protect,
  validate({
    params: commentIdSchema,
  }),
  commentController.deleteComment,
);

export default router;
