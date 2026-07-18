import Workspace from "../models/workspace.model.js";

const create = async (workspaceData, options = {}) => {
  return Workspace.create([workspaceData], options).then(
    ([workspace]) => workspace,
  );
};

const findById = (workspaceId, options = {}) => {
  return Workspace.findById(workspaceId, null, options);
};

const findBySlug = (slug, options = {}) => {
  return Workspace.findOne({ slug }, null, options);
};

const findAllByOwner = (owner, options = {}) => {
  return Workspace.find({ owner }, null, options);
};

const updateById = (workspaceId, updateData, options = {}) => {
  return Workspace.findByIdAndUpdate(workspaceId, updateData, {
    new: true,
    runValidators: true,
    ...options,
  });
};

const deleteById = (workspaceId, options = {}) => {
  return Workspace.findByIdAndDelete(workspaceId, options);
};

const workspaceRepository = {
  create,
  findById,
  findBySlug,
  findAllByOwner,
  updateById,
  deleteById,
};

export default workspaceRepository;
