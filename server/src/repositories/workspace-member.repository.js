import WorkspaceMember from "../models/workspace-member.model";

const create = (memberData) => {
  return WorkspaceMember.create(memberData);
};

const findById = (memberId) => {
  return WorkspaceMember.findById(memberId);
};

const findByWorkspaceAndUser = (workspaceId, userId) => {
  return WorkspaceMember.findOne({
    workspace: workspaceId,
    user: userId,
  });
};

const findAllByWorkspace = (workspaceId) => {
  return WorkspaceMember.find({ workspace: workspaceId });
};

const findAllByUser = (userId) => {
  return WorkspaceMember.find({ user: userId });
};

const updateById = (memberId, updateData) => {
  return WorkspaceMember.findByIdAndUpdate(memberId, updateData, {
    new: true,
    runValidators: true,
  });
};

const deleteById = (memberId) => {
  return WorkspaceMember.findByIdAndDelete(memberId);
};

const workspaceMemberRepository = {
  create,
  findById,
  findByWorkspaceAndUser,
  findAllByWorkspace,
  findAllByUser,
  updateById,
  deleteById,
};

export default workspaceMemberRepository;
