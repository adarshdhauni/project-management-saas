import Project from "../models/project.model.js";

const create = async (projectData, options = {}) => {
  const [project] = await Project.create([projectData], options);

  return project;
};

const findById = (projectId, options = {}) => {
  return Project.findById(projectId, null, options);
};

const findAllByWorkspace = async (workspaceId, filters = {}, options = {}) => {
  const { page = 1, limit = 20, search = "", archived } = filters;

  const skip = (page - 1) * limit;

  const query = {
    workspace: workspaceId,
  };

  if (archived !== undefined) {
    query.isArchived = archived === "true";
  }

  if (search.trim()) {
    query.name = {
      $regex: search.trim(),
      $options: "i",
    };
  }

  const [projects, total] = await Promise.all([
    Project.find(query, null, options)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Project.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    projects,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

const updateById = (projectId, updateData, options = {}) => {
  return Project.findByIdAndUpdate(projectId, updateData, {
    new: true,
    runValidators: true,
    ...options,
  });
};

const deleteById = (projectId, options = {}) => {
  return Project.findByIdAndDelete(projectId, options);
};

const findByWorkspaceAndName = (workspaceId, name, options = {}) => {
  return Project.findOne(
    {
      workspace: workspaceId,
      name,
    },
    null,
    options,
  );
};

const findByWorkspaceAndId = (workspaceId, projectId, options = {}) => {
  return Project.findOne(
    {
      _id: projectId,
      workspace: workspaceId,
    },
    null,
    options,
  );
};

const countByWorkspace = (workspaceId, options = {}) => {
  return Project.countDocuments(
    {
      workspace: workspaceId,
    },
    options,
  );
};

const findRecentByWorkspace = (workspaceId, limit = 5, options = {}) => {
  return Project.find(
    {
      workspace: workspaceId,
    },
    null,
    options,
  )
    .sort({ updatedAt: -1 })
    .limit(limit)
    .lean();
};

const projectRepository = {
  create,
  findById,
  findAllByWorkspace,
  updateById,
  deleteById,
  findByWorkspaceAndName,
  findByWorkspaceAndId,
  countByWorkspace,
  findRecentByWorkspace,
};

export default projectRepository;
