import taskRepository from "../repositories/task.repository.js";
import projectRepository from "../repositories/project.repository.js";
import workspaceMemberRepository from "../repositories/workspace-member.repository.js";
import commentRepository from "../repositories/comment.repository.js";
import ApiError from "../utils/ApiError.js";

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

  return commentRepository.create({
    task: taskId,
    user: userId,
    content,
  });
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

const commentService = {
  createComment,
  getComments,
  getCommentById,
};

export default commentService;
