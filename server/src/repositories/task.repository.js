import Task from "../models/task.model.js";

const create = async (taskData, options = {}) => {
  const [task] = await Task.create([taskData], options);

  return task;
};

const findById = (taskId, options = {}) => {
  return Task.findById(taskId, null, options);
};

const findAllByProject = async (projectId, filters = {}, options = {}) => {
  const {
    status,
    priority,
    assignee,
    search,
    sortBy = "position",
    sortOrder = "asc",
    page = 1,
    limit = 20,
  } = filters;

  const query = {
    project: projectId,
  };

  if (status) {
    query.status = status;
  }

  if (priority) {
    query.priority = priority;
  }

  if (assignee) {
    query.assignee = assignee;
  }

  if (search) {
    query.$or = [
      {
        title: {
          $regex: search,
          options: "i",
        },
      },
      {
        description: {
          $regex: search,
          options: "i",
        },
      },
    ];
  }

  const skip = (page - 1) * limit;

  const sort = {
    [sortBy]: sortOrder === "asc" ? 1 : -1,
  };

  const [tasks, total] = await Promise.all([
    Task.find(query, null, options).sort(sort).skip(skip).limit(limit),

    Task.countDocuments(query),
  ]);

  return {
    tasks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1,
    },
  };
};

const findLastByProject = (projectId, options = {}) => {
  return Task.findOne({ project: projectId }, null, options).sort({
    position: -1,
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
  findLastByProject,
  updateById,
  deleteById,
};

export default taskRepository;
