import Comment from "../models/comment.model.js";

const create = async (commentData, options = {}) => {
  const [comment] = await Comment.create([commentData], options);

  return comment;
};

const findById = (commentId, options = {}) => {
  return Comment.findById(commentId, null, options);
};

const findAllByTask = (taskId, options = {}) => {
  return Comment.find(
    {
      task: taskId,
    },
    null,
    options,
  ).sort({
    createdAt: -1,
  });
};

const updateById = (commentId, updateData, options = {}) => {
  return Comment.findByIdAndUpdate(commentId, updateData, {
    new: true,
    runValidators: true,
    ...options,
  });
};

const deleteById = (commentId, options = {}) => {
  return Comment.findByIdAndDelete(commentId, options);
};

const commentRepository = {
  create,
  findById,
  findAllByTask,
  updateById,
  deleteById,
};

export default commentRepository;
