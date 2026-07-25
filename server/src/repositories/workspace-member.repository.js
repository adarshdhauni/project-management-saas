import WorkspaceMember from "../models/workspace-member.model.js";

const create = async (memberData, options = {}) => {
  const [member] = await WorkspaceMember.create([memberData], options);

  return member;
};

const findById = (memberId, options = {}) => {
  return WorkspaceMember.findById(memberId, null, options);
};

const findByWorkspaceAndUser = (workspaceId, userId, options = {}) => {
  return WorkspaceMember.findOne(
    {
      workspace: workspaceId,
      user: userId,
    },
    null,
    options,
  );
};

const findAllByWorkspace = (workspaceId, options = {}) => {
  return WorkspaceMember.find({ workspace: workspaceId }, null, options);
};

const findAllByUser = (userId, options = {}) => {
  return WorkspaceMember.find({ user: userId }, null, options).populate(
    "workspace",
  );
};

const updateById = (memberId, updateData, options = {}) => {
  return WorkspaceMember.findByIdAndUpdate(memberId, updateData, {
    new: true,
    runValidators: true,
    ...options,
  });
};

const deleteById = (memberId, options = {}) => {
  return WorkspaceMember.findByIdAndDelete(memberId, options);
};

const deleteAllByWorkspace = (workspaceId, options = {}) => {
  return WorkspaceMember.deleteMany(
    {
      workspace: workspaceId,
    },
    options,
  );
};

const workspaceMemberRepository = {
  create,
  findById,
  findByWorkspaceAndUser,
  findAllByWorkspace,
  findAllByUser,
  updateById,
  deleteById,
  deleteAllByWorkspace,
};

export default workspaceMemberRepository;
