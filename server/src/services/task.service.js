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

const taskService = {
  createTask,
};

export default taskService;
