import express from "express";

import workspaceController from "../controllers/workspace.controller.js";
import { protect } from "../middlewares/protect.js";
import validate from "../middlewares/validate.js";
import createWorkspaceSchema from "../validators/workspace/create-workspace.schema.js";
import workspaceIdSchema from "../validators/workspace/workspace-id.schema.js";
import updateWorkspaceSchema from "../validators/workspace/update-workspace.schema.js";
import inviteMemberSchema from "../validators/workspace/invite-member.schema.js";
import invitationIdSchema from "../validators/workspace/invitation-id.schema.js";
import workspaceMemberParamsSchema from "../validators/workspace/workspace-member-params.schema.js";
import updateMemberRoleSchema from "../validators/workspace/update-member-role.schema.js";
import createProjectSchema from "../validators/project/create-project.schema.js";
import projectController from "../controllers/project.controller.js";

const router = express.Router();

router.post(
  "/",
  protect,
  validate({ body: createWorkspaceSchema }),
  workspaceController.createWorkspace,
);

router.get("/", protect, workspaceController.getUserWorkspaces);

router.get(
  "/:workspaceId",
  protect,
  validate({ params: workspaceIdSchema }),
  workspaceController.getWorkspaceById,
);

router.patch(
  "/:workspaceId",
  protect,
  validate({ params: workspaceIdSchema }),
  validate({ body: updateWorkspaceSchema }),
  workspaceController.updateWorkspace,
);

router.delete(
  "/:workspaceId",
  protect,
  validate({ params: workspaceIdSchema }),
  workspaceController.deleteWorkspace,
);

router.post(
  "/:workspaceId/invite",
  protect,
  validate({ params: workspaceIdSchema }),
  validate({ body: inviteMemberSchema }),
  workspaceController.inviteMember,
);

router.post(
  "/invitations/:invitationId/accept",
  protect,
  validate({
    params: invitationIdSchema,
  }),
  workspaceController.acceptInvitation,
);

router.post(
  "/invitations/:invitationId/reject",
  protect,
  validate({
    params: invitationIdSchema,
  }),
  workspaceController.rejectInvitation,
);

router.get(
  "/invitations",
  protect,
  workspaceController.getMyPendingInvitations,
);

router.get(
  "/:workspaceId/members",
  protect,
  validate({
    params: workspaceIdSchema,
  }),
  workspaceController.getWorkspaceMembers,
);

router.patch(
  "/:workspaceId/members/:memberId",
  protect,
  validate({
    params: workspaceMemberParamsSchema,
  }),
  validate({
    body: updateMemberRoleSchema,
  }),
  workspaceController.updateMemberRole,
);

router.delete(
  "/:workspaceId/members/:memberId",
  protect,
  validate({
    params: workspaceMemberParamsSchema,
  }),
  workspaceController.removeMember,
);

router.delete(
  "/:workspaceId/leave",
  protect,
  validate({
    params: workspaceIdSchema,
  }),
  workspaceController.leaveWorkspace,
);

router.post(
  "/:workspaceId/projects",
  protect,
  validate({
    params: workspaceIdSchema,
  }),
  validate({
    body: createProjectSchema,
  }),
  projectController.createProject,
);

router.get(
  "/:workspaceId/projects",
  protect,
  validate({
    params: workspaceIdSchema,
  }),
  projectController.getProjects,
);

export default router;
