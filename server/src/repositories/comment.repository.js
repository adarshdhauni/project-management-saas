import Comment from "../models/comment.model.js";

const create = async (commentData, options = {}) => {
  const [comment] = await Comment.create([commentData], options);

  return comment;
};

const findById = (commentId, options = {}) => {
  return Comment.findById(commentId, null, options);
};

const findAllByTask = async (taskId, filters = {}, options = {}) => {
  const { page = 1, limit = 20 } = filters;

  const query = {
    task: taskId,
  };

  const skip = (page - 1) * limit;

  const [comments, total] = await Promise.all([
    Comment.find(query, null, options)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Comment.countDocuments(query),
  ]);

  return {
    comments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1,
    },
  };
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
