import ApiError from "../utils/ApiError.js";
import activityRepository from "../repositories/activity.repository.js";
import workspaceMemberRepository from "../repositories/workspace-member.repository.js";

const createActivity = async ({
  workspaceId,
  userId,
  action,
  entityType,
  entityId,
  metadata = {},
}) => {
  return activityRepository.create({
    workspace: workspaceId,
    user: userId,
    action,
    entityType,
    entityId,
    metadata,
  });
};

const getActivities = async (userId, workspaceId, filters = {}) => {
  const membership = await workspaceMemberRepository.findByWorkspaceAndUser(
    workspaceId,
    userId,
  );

  if (!membership) {
    throw new ApiError(403, "You do not have access to this workspace.");
  }

  return activityRepository.findAllByWorkspace(workspaceId, filters);
};

const activityService = {
  createActivity,
  getActivities,
};

export default activityService;
