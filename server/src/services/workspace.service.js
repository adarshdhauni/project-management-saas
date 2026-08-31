import slugify from "slugify";

import ApiError from "../utils/ApiError.js";
import workspaceRepository from "../repositories/workspace.repository.js";
import workspaceMemberRepository from "../repositories/workspace-member.repository.js";
import workspaceInvitationRepository from "../repositories/workspace-invitation.repository.js";
import mongoose from "mongoose";
import userRepository from "../repositories/user.repository.js";
import activityService from "./activity.service.js";
import notificationService from "./notification.services.js";

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

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

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

    await activityService.createActivity(
      {
        workspaceId: workspace._id,
        userId,
        action: "workspace.created",
        entityType: "Workspace",
        entityId: workspace._id,
        metadata: {
          name: workspace.name,
        },
      },
      { session },
    );

    await session.commitTransaction();

    return workspace;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};

const getUserWorkspaces = async (userId) => {
  const memberships = await workspaceMemberRepository.findAllByUser(userId);

  const workspaces = memberships.map((membership) => membership.workspace);

  return workspaces;
};

const getWorkspaceById = async (userId, workspaceId) => {
  const workspace = await workspaceRepository.findById(workspaceId);

  if (!workspace) {
    throw new ApiError(404, "Workspace not found.");
  }

  const membership = await workspaceMemberRepository.findByWorkspaceAndUser(
    workspaceId,
    userId,
  );

  if (!membership) {
    throw new ApiError(403, "You do not have access to this workspace.");
  }

  return workspace;
};

const updateWorkspace = async (userId, workspaceId, updateData) => {
  const workspace = await workspaceRepository.findById(workspaceId);

  if (!workspace) {
    throw new ApiError(404, "Workspace not found.");
  }

  const membership = await workspaceMemberRepository.findByWorkspaceAndUser(
    workspaceId,
    userId,
  );

  if (!membership) {
    throw new ApiError(403, "You do not have access to this workspace.");
  }

  if (membership.role !== "owner") {
    throw new ApiError(
      403,
      "Only the workspace owner can update this workspace.",
    );
  }

  if (updateData.name && updateData.name !== workspace.name) {
    const slug = slugify(updateData.name, {
      lower: true,
      strict: true,
      trim: true,
    });

    const slugExists = await workspaceRepository.findBySlug(slug);

    if (slugExists) {
      throw new ApiError(409, "Workspace with this name already exists.");
    }

    updateData.slug = slug;
  }

  const changes = {};

  for (const [key, value] of Object.entries(updateData)) {
    if (workspace[key]?.toString() !== value?.toString()) {
      changes[key] = {
        from: workspace[key],
        to: value,
      };
    }
  }

  if (Object.keys(changes).length === 0) {
    throw new ApiError(400, "No changes provided.");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const updatedWorkspace = await workspaceRepository.updateById(
      workspaceId,
      updateData,
      { session },
    );

    await activityService.createActivity(
      {
        workspaceId: workspace._id,
        userId,
        action: "workspace.updated",
        entityType: "Workspace",
        entityId: workspace._id,
        metadata: {
          changes,
        },
      },
      { session },
    );

    await session.commitTransaction();

    return updatedWorkspace;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};

const deleteWorkspace = async (userId, workspaceId) => {
  const workspace = await workspaceRepository.findById(workspaceId);

  if (!workspace) {
    throw new ApiError(404, "Workspace not found.");
  }

  const membership = await workspaceMemberRepository.findByWorkspaceAndUser(
    workspaceId,
    userId,
  );

  if (!membership) {
    throw new ApiError(403, "You do not have access to this workspace.");
  }

  if (membership.role !== "owner") {
    throw new ApiError(
      403,
      "Only the workspace owner can delete this workspace.",
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await workspaceMemberRepository.deleteAllByWorkspace(workspaceId, {
      session,
    });

    await activityService.createActivity(
      {
        workspaceId: workspace._id,
        userId,
        action: "workspace.deleted",
        entityType: "Workspace",
        entityId: workspace._id,
        metadata: {
          name: workspace.name,
        },
      },
      { session },
    );

    await workspaceRepository.deleteById(workspaceId, { session });

    await session.commitTransaction();

    return;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};

const inviteMember = async (userId, workspaceId, inviteData) => {
  const { email, role } = inviteData;

  const workspace = await workspaceRepository.findById(workspaceId);

  if (!workspace) {
    throw new ApiError(404, "Workspace not found.");
  }

  const membership = await workspaceMemberRepository.findByWorkspaceAndUser(
    workspaceId,
    userId,
  );

  if (!membership) {
    throw new ApiError(403, "You do not have access to this workspace.");
  }

  if (membership.role !== "owner") {
    throw new ApiError(403, "Only the workspace owner can invite members.");
  }

  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (user._id.equals(userId)) {
    throw new ApiError(400, "You cannot invite yourself.");
  }

  const isMember = await workspaceMemberRepository.findByWorkspaceAndUser(
    workspaceId,
    user._id,
  );

  if (isMember) {
    throw new ApiError(409, "User is already a member.");
  }

  const isPending =
    await workspaceInvitationRepository.findPendingByWorkspaceAndEmail(
      workspaceId,
      email,
    );

  if (isPending) {
    throw new ApiError(
      409,
      "A pending invitation already exists for this user.",
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const invitation = await workspaceInvitationRepository.create(
      {
        workspace: workspaceId,
        invitedBy: userId,
        email,
        role,
      },
      { session },
    );

    await activityService.createActivity(
      {
        workspaceId: workspace._id,
        userId,
        action: "member.invited",
        entityType: "Workspace",
        entityId: workspace._id,
        metadata: {
          email,
          role,
        },
      },
      { session },
    );

    await notificationService.createNotification(
      {
        recipient: user._id,
        actor: userId,
        workspace: workspace._id,
        type: "workspace.invited",
        entityType: "Workspace",
        entityId: workspace._id,
        metadata: {
          workspaceName: workspace.name,
          role,
          invitationId: invitation._id,
        },
      },
      { session },
    );

    await session.commitTransaction();

    return invitation;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};

const acceptInvitation = async (userId, invitationId) => {
  const invitation = await workspaceInvitationRepository.findById(invitationId);

  if (!invitation) {
    throw new ApiError(404, "Invitation does not exist.");
  }

  if (invitation.status !== "pending") {
    throw new ApiError(409, "This invitation has already been processed.");
  }

  if (invitation.expiresAt < new Date()) {
    throw new ApiError(410, "This invitation has expired.");
  }

  const user = await userRepository.findUserById(userId);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (invitation.email !== user.email) {
    throw new ApiError(403, "This invitation does not belong to you.");
  }

  const isMember = await workspaceMemberRepository.findByWorkspaceAndUser(
    invitation.workspace,
    userId,
  );

  if (isMember) {
    throw new ApiError(409, "User is already a member.");
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const workspaceMember = await workspaceMemberRepository.create(
      {
        workspace: invitation.workspace,
        user: userId,
        role: invitation.role,
        invitedBy: invitation.invitedBy,
      },
      { session },
    );

    await workspaceInvitationRepository.updateById(
      invitationId,
      {
        status: "accepted",
      },
      { session },
    );

    await activityService.createActivity(
      {
        workspaceId: invitation.workspace,
        userId,
        action: "member.joined",
        entityType: "WorkspaceMember",
        entityId: workspaceMember._id,
        metadata: {
          role: workspaceMember.role,
        },
      },
      { session },
    );

    await session.commitTransaction();

    return workspaceMember;
  } catch (error) {
    await session.abortTransaction();

    if (error.code === 11000) {
      throw new ApiError(409, "User is already a member.");
    }

    throw error;
  } finally {
    await session.endSession();
  }
};

const rejectInvitation = async (userId, invitationId) => {
  const invitation = await workspaceInvitationRepository.findById(invitationId);

  if (!invitation) {
    throw new ApiError(404, "Invitation does not exist.");
  }

  if (invitation.status !== "pending") {
    throw new ApiError(409, "This invitation has already been processed.");
  }

  if (invitation.expiresAt < new Date()) {
    throw new ApiError(410, "This invitation has expired.");
  }

  const user = await userRepository.findUserById(userId);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  if (invitation.email !== user.email) {
    throw new ApiError(403, "This invitation does not belong to you.");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await workspaceInvitationRepository.updateById(
      invitationId,
      {
        status: "rejected",
      },
      { session },
    );

    await activityService.createActivity(
      {
        workspaceId: invitation.workspace,
        userId,
        action: "member.invitation_rejected",
        entityType: "Workspace",
        entityId: invitation.workspace,
        metadata: {
          email: invitation.email,
          role: invitation.role,
        },
      },
      { session },
    );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};

const getMyPendingInvitations = async (userId) => {
  const user = await userRepository.findUserById(userId);

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const pendingInvitations =
    await workspaceInvitationRepository.findPendingByEmail(user.email);

  return pendingInvitations;
};

const getWorkspaceMembers = async (userId, workspaceId) => {
  const workspace = await workspaceRepository.findById(workspaceId);

  if (!workspace) {
    throw new ApiError(404, "Workspace not found.");
  }

  const isMember = await workspaceMemberRepository.findByWorkspaceAndUser(
    workspaceId,
    userId,
  );

  if (!isMember) {
    throw new ApiError(403, "You do not have access to this workspace.");
  }

  const workspaceMembers =
    await workspaceMemberRepository.findAllByWorkspace(workspaceId);

  return workspaceMembers;
};

const updateMemberRole = async (userId, workspaceId, memberId, role) => {
  const workspace = await workspaceRepository.findById(workspaceId);

  if (!workspace) {
    throw new ApiError(404, "Workspace not found.");
  }

  const requesterMembership =
    await workspaceMemberRepository.findByWorkspaceAndUser(workspaceId, userId);

  if (!requesterMembership) {
    throw new ApiError(403, "You do not have access to this workspace.");
  }

  if (requesterMembership.role !== "owner") {
    throw new ApiError(
      403,
      "Only the workspace owner can update member roles.",
    );
  }

  const targetMember = await workspaceMemberRepository.findById(memberId);

  if (!targetMember) {
    throw new ApiError(404, "Member not found.");
  }

  if (!targetMember.workspace.equals(workspaceId)) {
    throw new ApiError(400, "Member does not belong to this workspace.");
  }

  if (targetMember.role === "owner") {
    throw new ApiError(409, "Owner role cannot be modified.");
  }

  if (targetMember.role === role) {
    throw new ApiError(409, "Member already has this role.");
  }

  const previousRole = targetMember.role;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const updatedMember = await workspaceMemberRepository.updateById(
      memberId,
      {
        role,
      },
      { session },
    );

    await activityService.createActivity(
      {
        workspaceId,
        userId,
        action: "member.role_changed",
        entityType: "WorkspaceMember",
        entityId: targetMember._id,
        metadata: {
          userId: targetMember.user,
          from: previousRole,
          to: role,
        },
      },
      { session },
    );

    await notificationService.createNotification(
      {
        recipient: targetMember.user,
        actor: userId,
        workspace: workspaceId,
        type: "member.role_changed",
        entityType: "WorkspaceMember",
        entityId: targetMember._id,
        metadata: {
          previousRole,
          newRole: role,
        },
      },
      { session },
    );

    await session.commitTransaction();

    return updatedMember;
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};

const removeMember = async (userId, workspaceId, memberId) => {
  const workspace = await workspaceRepository.findById(workspaceId);

  if (!workspace) {
    throw new ApiError(404, "Workspace not found.");
  }

  const requesterMembership =
    await workspaceMemberRepository.findByWorkspaceAndUser(workspaceId, userId);

  if (!requesterMembership) {
    throw new ApiError(403, "You do not have access to this workspace.");
  }

  if (requesterMembership.role !== "owner") {
    throw new ApiError(403, "Only the workspace owner can remove a member.");
  }

  const targetMember = await workspaceMemberRepository.findById(memberId);

  if (!targetMember) {
    throw new ApiError(404, "Member not found.");
  }

  if (!targetMember.workspace.equals(workspaceId)) {
    throw new ApiError(400, "Member does not belong to this workspace.");
  }

  if (targetMember.role === "owner") {
    throw new ApiError(409, "Owner cannot be removed.");
  }

  if (targetMember.user.equals(userId)) {
    throw new ApiError(409, "Workspace owner cannot remove themselves.");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await workspaceMemberRepository.deleteById(memberId, { session });

    await activityService.createActivity(
      {
        workspaceId,
        userId,
        action: "member.removed",
        entityType: "WorkspaceMember",
        entityId: targetMember._id,
        metadata: {
          userId: targetMember.user,
          role: targetMember.role,
        },
      },
      { session },
    );

    await notificationService.createNotification(
      {
        recipient: targetMember.user,
        actor: userId,
        workspace: workspaceId,
        type: "member.removed",
        entityType: "WorkspaceMember",
        entityId: targetMember._id,
        metadata: {
          workspaceName: workspace.name,
        },
      },
      { session },
    );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};

const leaveWorkspace = async (userId, workspaceId) => {
  const workspace = await workspaceRepository.findById(workspaceId);

  if (!workspace) {
    throw new ApiError(404, "Workspace not found.");
  }

  const membership = await workspaceMemberRepository.findByWorkspaceAndUser(
    workspaceId,
    userId,
  );

  if (!membership) {
    throw new ApiError(403, "You are not a member of this workspace.");
  }

  if (membership.role === "owner") {
    throw new ApiError(
      409,
      "Workspace owner cannot leave the workspace. Transfer ownership or delete the workspace instead.",
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await workspaceMemberRepository.deleteById(membership._id, { session });

    await activityService.createActivity(
      {
        workspaceId,
        userId,
        action: "member.left",
        entityType: "WorkspaceMember",
        entityId: membership._id,
        metadata: {
          role: membership.role,
        },
      },
      { session },
    );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();

    throw error;
  } finally {
    await session.endSession();
  }
};

const workspaceService = {
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
  removeMember,
  leaveWorkspace,
};

export default workspaceService;
