import slugify from "slugify";

import ApiError from "../utils/ApiError.js";
import workspaceRepository from "../repositories/workspace.repository.js";
import workspaceMemberRepository from "../repositories/workspace-member.repository.js";
slugify("My Workspace");

const createWorkspace = async (userId, workspaceData) => {
  const slug = slugify(workspaceData.name, {
    lower: true,
    strict: true,
    trim: true,
  });

  const existingWorkspace = await workspaceRepository.findBySlug(slug);

  if (existingWorkspace) {
    throw new ApiError(409, "Workspace with this name already exists.");
  }

  const workspaceToCreate = {
    ...workspaceData,
    slug,
    owner: userId,
  };

  const workspace = await workspaceRepository.create(workspaceToCreate);

  const memberData = {
    workspace: workspace._id,
    user: userId,
    role: "owner",
    invitedBy: userId,
  };

  await workspaceMemberRepository.create(memberData);

  return workspace
};

const workspaceService = {
  createWorkspace,
};

export default workspaceService;
