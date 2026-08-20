import taskRepository from "../repositories/task.repository.js";
import projectRepository from "../repositories/project.repository.js";
import workspaceMemberRepository from "../repositories/workspace-member.repository.js";
import ApiError from "../utils/ApiError.js";

const createTask = async (userId, projectId, taskData) => {
  const project = await projectRepository.findById(projectId);

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

  if (taskData.assignee) {
    const assigneeMembership =
      await workspaceMemberRepository.findByWorkspaceAndUser(
        project.workspace,
        taskData.assignee,
      );

    if (!assigneeMembership) {
      throw new ApiError(400, "Assignee must be a member of the workspace.");
    }
  }

  const task = await taskRepository.create({
    ...taskData,
    project: projectId,
    createdBy: userId,
    position: 0,
  });

  return task;
};

const getTasks = async (userId, projectId) => {
  const project = await projectRepository.findById(projectId);

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

  const tasks = await taskRepository.findAllByProject(projectId);

  return tasks;
};

const getTaskById = async (userId, taskId) => {
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

  return task;
};

const updateTask = async (userId, taskId, taskData) => {
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

  if (taskData.assignee !== undefined && taskData.assignee !== null) {
    const assigneeMembership =
      await workspaceMemberRepository.findByWorkspaceAndUser(
        project.workspace,
        taskData.assignee,
      );

    if (!assigneeMembership) {
      throw new ApiError(400, "Assignee must be a member of the workspace.");
    }
  }

  const updatedTask = await taskRepository.updateById(taskId, taskData);

  return updatedTask;
};

const deleteTask = async (userId, taskId) => {
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

  await taskRepository.deleteById(taskId);

  return;
};

const taskService = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
};

export default taskService;
