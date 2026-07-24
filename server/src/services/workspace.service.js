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

const workspaceService = {
  createWorkspace,
};

export default workspaceService;
