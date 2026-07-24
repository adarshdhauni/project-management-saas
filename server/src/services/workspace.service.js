import slugify from "slugify";

import ApiError from "../utils/ApiError.js";
import workspaceRepository from "../repositories/workspace.repository.js";
import workspaceMemberRepository from "../repositories/workspace-member.repository.js";
import mongoose from "mongoose";

const createWorkspace = async (userId, workspaceData) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const slug = slugify(workspaceData.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    const existingWorkspace = await workspaceRepository.findBySlug(slug, {
      session,
    });

    if (existingWorkspace) {
      throw new ApiError(409, "Workspace with this name already exists.");
    }

    const workspaceToCreate = {
      ...workspaceData,
      slug,
      owner: userId,
    };

    const workspace = await workspaceRepository.create(workspaceToCreate, {
      session,
    });

    const memberData = {
      workspace: workspace._id,
      user: userId,
      role: "owner",
      invitedBy: userId,
    };

    await workspaceMemberRepository.create(memberData, { session });

    await session.commitTransaction();

    return workspace;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};

const getUserWorkspaces = async (userId) => {
  const memberships = await workspaceMemberRepository.findAllByUser(userId);

  const workspaces = memberships.map((membership) => membership.workspace);

  return workspaces;
};

const getWorkspaceById = async (userId, workspaceId) => {
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

  return workspace;
};

const updateWorkspace = async (userId, workspaceId, updateData) => {
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

  if (membership.role !== "owner") {
    throw new ApiError(
      403,
      "Only the workspace owner can update this workspace.",
    );
  }

  if (updateData.name && updateData.name !== workspace.name) {
    const slug = slugify(updateData.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    const slugExists = await workspaceRepository.findBySlug(slug);

    if (slugExists) {
      throw new ApiError(409, "Workspace with this name already exists.");
    }

    updateData.slug = slug;
  }

  const updatedWorkspace = await workspaceRepository.updateById(
    workspaceId,
    updateData,
  );

  return updatedWorkspace;
};

const workspaceService = {
  createWorkspace,
  getUserWorkspaces,
  getWorkspaceById,
  updateWorkspace,
};

export default workspaceService;
