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

const getWorkspaceById = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const workspaceId = req.params.workspaceId;

  const workspace = await workspaceService.getWorkspaceById(
    userId,
    workspaceId,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, workspace, "Workspace fetched successfully."));
});

const updateWorkspace = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const workspaceId = req.params.workspaceId;

  const updatedWorkspace = await workspaceService.updateWorkspace(
    userId,
    workspaceId,
    req.body,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedWorkspace, "Workspace updated successfully."),
    );
});

const workspaceController = {
  createWorkspace,
  getUserWorkspaces,
  getWorkspaceById,
  updateWorkspace
};

export default workspaceController;
