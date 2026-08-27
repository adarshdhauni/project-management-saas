import taskRepository from "../repositories/task.repository.js";
import projectRepository from "../repositories/project.repository.js";
import workspaceMemberRepository from "../repositories/workspace-member.repository.js";
import commentRepository from "../repositories/comment.repository.js";
import ApiError from "../utils/ApiError.js";
import activityService from "./activity.service.js";

const createComment = async (userId, taskId, content) => {
  const task = await taskRepository.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  const project = await projectRepository.findById(task.project);

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const membership = await workspaceMemberRepository.findByWorkspaceAndUser(
    project.workspace,
    userId,
  );

  if (!membership) {
    throw new ApiError(403, "You do not have access to this workspace.");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const comment = await commentRepository.create(
      {
        task: taskId,
        user: userId,
        content,
      },
      { session },
    );

    await activityService.createActivity(
      {
        workspaceId: project.workspace,
        userId,
        action: "comment.created",
        entityType: "Comment",
        entityId: comment._id,
        metadata: {
          preview: content.slice(0, 100),
        },
      },
      { session },
    );

    await session.commitTransaction();

    return comment;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};

const getComments = async (userId, taskId, filters = {}) => {
  const task = await taskRepository.findById(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  const project = await projectRepository.findById(task.project);

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const membership = await workspaceMemberRepository.findByWorkspaceAndUser(
    project.workspace,
    userId,
  );

  if (!membership) {
    throw new ApiError(403, "You do not have access to this workspace.");
  }

  const result = await commentRepository.findAllByTask(taskId, filters);

  return result;
};

const getCommentById = async (userId, commentId) => {
  const comment = await commentRepository.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found.");
  }

  const task = await taskRepository.findById(comment.task);

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  const project = await projectRepository.findById(task.project);

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const membership = await workspaceMemberRepository.findByWorkspaceAndUser(
    project.workspace,
    userId,
  );

  if (!membership) {
    throw new ApiError(403, "You do not have access to this workspace.");
  }

  return comment;
};

const updateComment = async (userId, commentId, updatedContent) => {
  const comment = await commentRepository.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found.");
  }

  const task = await taskRepository.findById(comment.task);

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  const project = await projectRepository.findById(task.project);

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const membership = await workspaceMemberRepository.findByWorkspaceAndUser(
    project.workspace,
    userId,
  );

  if (!membership) {
    throw new ApiError(403, "You do not have access to this workspace.");
  }

  if (userId.toString() !== comment.user.toString()) {
    throw new ApiError(
      403,
      "You do not have permission to update this comment.",
    );
  }

  if (comment.content === updatedContent) {
    throw new ApiError(400, "No changes provided.");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const updatedComment = await commentRepository.updateById(
      commentId,
      {
        content: updatedContent,
      },
      { session },
    );

    await activityService.createActivity(
      {
        workspaceId: project.workspace,
        userId,
        action: "comment.updated",
        entityType: "Comment",
        entityId: comment._id,
        metadata: {
          from: comment.content,
          to: updatedContent,
        },
      },
      { session },
    );

    await session.commitTransaction();

    return updatedComment;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};

const deleteComment = async (userId, commentId) => {
  const comment = await commentRepository.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "Comment not found.");
  }

  const task = await taskRepository.findById(comment.task);

  if (!task) {
    throw new ApiError(404, "Task not found.");
  }

  const project = await projectRepository.findById(task.project);

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const membership = await workspaceMemberRepository.findByWorkspaceAndUser(
    project.workspace,
    userId,
  );

  if (!membership) {
    throw new ApiError(403, "You do not have access to this workspace.");
  }

  const isAuthor = comment.user.toString() === userId.toString();

  const isAdminOrOwner =
    membership.role === "owner" || membership.role === "admin";

  if (!isAuthor && !isAdminOrOwner) {
    throw new ApiError(
      403,
      "You do not have permission to delete this comment.",
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await commentRepository.deleteById(commentId, { session });

    await activityService.createActivity(
      {
        workspaceId: project.workspace,
        userId,
        action: "comment.deleted",
        entityType: "Comment",
        entityId: comment._id,
        metadata: {
          preview: comment.content.slice(0, 100),
        },
      },
      { session },
    );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};

const commentService = {
  createComment,
  getComments,
  getCommentById,
  updateComment,
  deleteComment,
};

export default commentService;
