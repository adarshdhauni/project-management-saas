import projectRepository from "../repositories/project.repository.js";
import workspaceRepository from "../repositories/workspace.repository.js";
import workspaceMemberRepository from "../repositories/workspace-member.repository.js";
import ApiError from "../utils/ApiError.js";
import activityService from "./activity.service.js";
import mongoose from "mongoose";

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

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const project = await projectRepository.create(
      {
        workspace: workspaceId,
        name,
        description,
        color,
        icon,
        createdBy: userId,
      },
      { session },
    );
    await activityService.createActivity(
      {
        workspaceId,
        userId,
        action: "project.created",
        entityType: "Project",
        entityId: project._id,
        metadata: {
          name: project.name,
        },
      },
      { session },
    );

    await session.commitTransaction();

    return project;
  } catch (error) {
    await session.abortTransaction();

    if (error.code === 11000) {
      throw new ApiError(
        409,
        "A project with this name already exists in the workspace.",
      );
    }

    throw error;
  } finally {
    await session.endSession();
  }
};

const getWorkspaceProjects = async (userId, workspaceId) => {
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

const getProjectById = async (userId, projectId) => {
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

  return project;
};

const updateProject = async (userId, projectId, projectData) => {
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

  if (membership.role !== "owner" && membership.role !== "admin") {
    throw new ApiError(
      403,
      "You do not have permission to update this project.",
    );
  }

  if (projectData.name && projectData.name !== project.name) {
    const existingProject = await projectRepository.findByWorkspaceAndName(
      project.workspace,
      projectData.name,
    );

    if (existingProject) {
      throw new ApiError(
        409,
        "A project with this name already exists in the workspace.",
      );
    }
  }

  const changes = {};

  for (const [key, value] of Object.entries(projectData)) {
    if (project[key]?.toString() !== value?.toString()) {
      changes[key] = {
        from: project[key],
        to: value,
      };
    }
  }

  if (Object.keys(changes).length === 0) {
    throw new ApiError(400, "No changes provided.");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const updatedProject = await projectRepository.updateById(
      projectId,
      projectData,
      { session },
    );

    await activityService.createActivity(
      {
        workspaceId: project.workspace,
        userId,
        action: "project.updated",
        entityType: "Project",
        entityId: project._id,
        metadata: {
          changes,
        },
      },
      { session },
    );

    await session.commitTransaction();

    return updatedProject;
  } catch (error) {
    await session.abortTransaction();

    if (error.code === 11000) {
      throw new ApiError(
        409,
        "A project with this name already exists in the workspace.",
      );
    }

    throw error;
  } finally {
    await session.endSession();
  }
};

const deleteProject = async (userId, projectId) => {
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

  if (membership.role !== "owner" && membership.role !== "admin") {
    throw new ApiError(
      403,
      "You do not have permission to delete this project.",
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await projectRepository.deleteById(projectId, { session });

    await activityService.createActivity(
      {
        workspaceId: project.workspace,
        userId,
        action: "project.deleted",
        entityType: "Project",
        entityId: project._id,
        metadata: {
          name: project.name,
        },
      },
      { session },
    );

    await session.commitTransaction();

    return;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};

const projectService = {
  createProject,
  getWorkspaceProjects,
  getProjectById,
  updateProject,
  deleteProject,
};

export default projectService;
