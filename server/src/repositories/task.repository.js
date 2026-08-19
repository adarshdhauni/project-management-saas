import Task from "../models/task.model.js";

const create = async (taskData, options = {}) => {
  const [task] = await Task.create([taskData], options);

  return task;
};

const findById = (taskId, options = {}) => {
  return Task.findById(taskId, null, options);
};

const findAllByProject = (projectId, options = {}) => {
  return Task.find(
    {
      project: projectId,
    },
    null,
    options,
  ).sort({
    position: 1,
  });
};

const updateById = (taskId, updateData, options = {}) => {
  return Task.findByIdAndUpdate(taskId, updateData, {
    new: true,
    runValidators: true,
    ...options,
  });
};

const deleteById = (taskId, options = {}) => {
  return Task.findByIdAndDelete(taskId, options);
};

const taskRepository = {
  create,
  findById,
  findAllByProject,
  updateById,
  deleteById,
};

export default taskRepository;
