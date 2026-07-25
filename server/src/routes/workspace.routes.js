import express from "express";

import workspaceController from "../controllers/workspace.controller.js";
import { protect } from "../middlewares/protect.js";
import validate from "../middlewares/validate.js";
import createWorkspaceSchema from "../validators/workspace/create-workspace.schema.js";
import getWorkspaceSchema from "../validators/workspace/get-workspace.schema.js";
import updateWorkspaceSchema from "../validators/workspace/update-workspace.schema.js";
import inviteMemberSchema from "../validators/workspace/invite-member.schema.js";
import acceptInvitationSchema from "../validators/workspace/accept-workspace.schema.js";

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
  validate({ params: getWorkspaceSchema }),
  workspaceController.getWorkspaceById,
);

router.patch(
  "/:workspaceId",
  protect,
  validate({ params: getWorkspaceSchema }),
  validate({ body: updateWorkspaceSchema }),
  workspaceController.updateWorkspace,
);

router.delete(
  "/:workspaceId",
  protect,
  validate({ params: getWorkspaceSchema }),
  workspaceController.deleteWorkspace,
);

router.post(
  "/:workspaceId/invite",
  protect,
  validate({ params: getWorkspaceSchema }),
  validate({ body: inviteMemberSchema }),
  workspaceController.inviteMember,
);

router.post(
  "/invitations/:invitationId/accept",
  protect,
  validate({
    params: acceptInvitationSchema,
  }),
  workspaceController.acceptInvitation,
);

export default router;
