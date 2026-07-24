import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import workspaceService from "../services/workspace.service.js";

const createWorkspace = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const workspace = await workspaceService.createWorkspace(userId, req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, workspace, "Workspace created successfully."));
});

const getUserWorkspaces = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const workspaces = await workspaceService.getUserWorkspaces(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, workspaces, "Workspaces fetched successfully."));
});

const workspaceController = {
  createWorkspace,
  getUserWorkspaces,
};

export default workspaceController;
