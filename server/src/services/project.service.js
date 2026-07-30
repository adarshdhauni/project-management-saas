import projectRepository from "../repositories/project.repository.js";
import workspaceRepository from "../repositories/workspace.repository.js";
import workspaceMemberRepository from "../repositories/workspace-member.repository.js";
import ApiError from "../utils/ApiError.js";

const createProject = async (userId, workspaceId, projectData) => {
  const { name, description, color, icon } = projectData;

  const workspace = await workspaceRepository.findById(workspaceId);

  if (!workspace) {
    throw new ApiError(404, "Workspace not found.");
  }

  const membership = await workspaceMemberRepository.findByWorkspaceAndUser(
    workspaceId,
    userId,
  );

  if (!membership) {
    throw new ApiError(403, "You do not have access to this workspace.");
  }

  const existingProject = await projectRepository.findByWorkspaceAndName(
    workspaceId,
    name,
  );

  if (existingProject) {
    throw new ApiError(
      409,
      "A project with this name already exists in the workspace.",
    );
  }

  try {
    return await projectRepository.create({
      workspace: workspaceId,
      name,
      description,
      color,
      icon,
      createdBy: userId,
    });
  } catch (error) {
    if (error.code === 11000) {
      throw new ApiError(
        409,
        "A project with this name already exists in the workspace.",
      );
    }

    throw error;
  }
};

const getProjects = async (userId, workspaceId) => {
  const workspace = await workspaceRepository.findById(workspaceId);

  if (!workspace) {
    throw new ApiError(404, "Workspace not found.");
  }

  const membership = await workspaceMemberRepository.findByWorkspaceAndUser(
    workspaceId,
    userId,
  );

  if (!membership) {
    throw new ApiError(403, "You do not have access to this workspace.");
  }

  const projects = await projectRepository.findAllByWorkspace(workspaceId);

  return projects;
};

const projectService = {
  createProject,
  getProjects
};

export default projectService;
