import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import workspaceService from "../services/workspace.service.js";

const createWorkspace = asyncHandler(async (req, res) => {
  console.log(req.headers["content-type"]);
  console.log(req.body);
  const userId = req.user._id;

  const workspace = await workspaceService.createWorkspace(userId, req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, workspace, "Workspace created successfully."));
});

const workspaceController = {
  createWorkspace,
};

export default workspaceController;
