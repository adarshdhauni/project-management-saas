import Activity from "../models/activity.model.js";

const create = async (activityData, options = {}) => {
  const [activity] = await Activity.create([activityData], options);

  return activity;
};

const findAllByWorkspace = async (workspaceId, filters = {}, options = {}) => {
  const { page = 1, limit = 20 } = filters;

  const query = {
    workspace: workspaceId,
  };

  const skip = (page - 1) * limit;

  const [activities, total] = await Promise.all([
    Activity.find(query, null, options)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Activity.countDocuments(query),
  ]);

  return {
    activities,
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

const findByEntity = async (entityType, entityId, options = {}) => {
  return Activity.find(
    {
      entityType,
      entityId,
    },
    null,
    options,
  ).sort({
    createdAt: -1,
  });
};

const activityRepository = {
  create,
  findAllByWorkspace,
  findByEntity,
};

export default activityRepository;
