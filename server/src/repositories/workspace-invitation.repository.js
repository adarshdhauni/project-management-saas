import WorkspaceInvitation from "../models/workspace-invitation.model.js";

const create = async (invitationData, options = {}) => {
  const [invitation] = await WorkspaceInvitation.create(
    [invitationData],
    options,
  );

  return invitation;
};

const findById = (invitationId, options = {}) => {
  return WorkspaceInvitation.findById(invitationId, null, options);
};

const findPendingByWorkspaceAndEmail = (workspaceId, email, options = {}) => {
  return WorkspaceInvitation.findOne(
    {
      workspace: workspaceId,
      email,
      status: "pending",
    },
    null,
    options,
  );
};

const findPendingByEmail = (email, options = {}) => {
  return WorkspaceInvitation.find(
    {
      email,
      status: "pending",
    },
    null,
    options,
  ).populate("workspace invitedBy");
};

const findAllByWorkspace = (workspaceId, options = {}) => {
  return WorkspaceInvitation.find(
    {
      workspace: workspaceId,
    },
    null,
    options,
  ).populate("invitedBy");
};

const updateById = (invitationId, updateData, options = {}) => {
  return WorkspaceInvitation.findByIdAndUpdate(invitationId, updateData, {
    new: true,
    runValidators: true,
    ...options,
  });
};

const deleteById = (invitationId, options = {}) => {
  return WorkspaceInvitation.findByIdAndDelete(invitationId, options);
};

const updateMany = (filter, updateData, options = {}) => {
  return WorkspaceInvitation.updateMany(filter, updateData, options);
};

const updatePendingById = (invitationId, updateData, options = {}) => {
  return WorkspaceInvitation.findOneAndUpdate(
    {
      _id: invitationId,
      status: "pending",
      expiresAt: { $gt: new Date() },
    },
    updateData,
    {
      new: true,
      runValidators: true,
      ...options,
    },
  );
};

const expireIfPendingAndExpired = (invitationId, options = {}) => {
  return WorkspaceInvitation.findOneAndUpdate(
    {
      _id: invitationId,
      status: "pending",
      expiresAt: { $lte: new Date() },
    },
    { $set: { status: "expired" } },
    {
      new: true,
      runValidators: true,
      ...options,
    },
  );
};

const findStatusesByIds = (invitationIds, options = {}) => {
  return WorkspaceInvitation.find(
    { _id: { $in: invitationIds } },
    { _id: 1, status: 1, expiresAt: 1 },
    options,
  ).lean();
};

const workspaceInvitationRepository = {
  create,
  findById,
  findPendingByWorkspaceAndEmail,
  findPendingByEmail,
  findAllByWorkspace,
  updateById,
  deleteById,
  updateMany,
  updatePendingById,
  expireIfPendingAndExpired,
  findStatusesByIds,
};

export default workspaceInvitationRepository;
