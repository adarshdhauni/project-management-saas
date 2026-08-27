import express from "express";
import { protect } from "../middlewares/protect.js";
import validate from "../middlewares/validate.js";
import commentController from "../controllers/comment.controller.js";
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

export default router;
