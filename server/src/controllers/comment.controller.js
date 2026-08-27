import commentService from "../services/comment.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

const createComment = asyncHandler(async (req, res) => {
  const comment = await commentService.createComment(
    req.user._id,
    req.params.taskId,
    req.body.content,
  );

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment created successfully."));
});

const getComments = asyncHandler(async (req, res) => {
  const result = await commentService.getComments(
    req.user._id,
    req.params.taskId,
    req.query,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Comments retrieved successfully."));
});

const getCommentById = asyncHandler(async (req, res) => {
  const comment = await commentService.getCommentById(
    req.user._id,
    req.params.commentId,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment retrieved successfully."));
});

const commentController = {
  createComment,
  getComments,
  getCommentById,
};

export default commentController;
