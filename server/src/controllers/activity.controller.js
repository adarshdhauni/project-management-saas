import asyncHandler from "../utils/asyncHandler.js";
import activityService from "../services/activity.service.js";
import ApiResponse from "../utils/ApiResponse.js";

const getActivities = asyncHandler(async (req, res) => {
  const result = await activityService.getActivities(
    req.user._id,
    req.params.workspaceId,
    req.query,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Activities retrieved successfully."));
});

const activityController = { getActivities };

export default activityController;
