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

const deleteWorkspace = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const workspaceId = req.params.workspaceId;

  await workspaceService.deleteWorkspace(userId, workspaceId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Workspace deleted successfully."));
});

const inviteMember = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const workspaceId = req.params.workspaceId;

  const invitation = await workspaceService.inviteMember(
    userId,
    workspaceId,
    req.body,
  );

  return res
    .status(201)
    .json(new ApiResponse(201, invitation, "Invitation sent successfully."));
});

const acceptInvitation = asyncHandler(async (req, res) => {
  const workspaceMember = await workspaceService.acceptInvitation(
    req.user._id,
    req.params.invitationId,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        workspaceMember,
        "Invitation accepted successfully.",
      ),
    );
});

const rejectInvitation = asyncHandler(async (req, res) => {
  await workspaceService.rejectInvitation(
    req.user._id,
    req.params.invitationId,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Invitation rejected successfully."));
});

const getMyPendingInvitations = asyncHandler(async (req, res) => {
  const invitations = await workspaceService.getMyPendingInvitations(
    req.user._id,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        invitations,
        "Pending invitations fetched successfully.",
      ),
    );
});

const getWorkspaceMembers = asyncHandler(async (req, res) => {
  const members = await workspaceService.getWorkspaceMembers(
    req.user._id,
    req.params.workspaceId,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, members, "Workspace members fetched successfully."),
    );
});

const updateMemberRole = asyncHandler(async (req, res) => {
  const updatedMember = await workspaceService.updateMemberRole(
    req.user._id,
    req.params.workspaceId,
    req.params.memberId,
    req.body.role,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedMember, "Member role updated successfully."),
    );
});

const removeMember = asyncHandler(async (req, res) => {
  await workspaceService.removeMember(
    req.user._id,
    req.params.workspaceId,
    req.params.memberId,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Member removed successfully."));
});

const workspaceController = {
  createWorkspace,
  getUserWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  inviteMember,
  acceptInvitation,
  rejectInvitation,
  getMyPendingInvitations,
  getWorkspaceMembers,
  updateMemberRole,
  removeMember
};

export default workspaceController;
