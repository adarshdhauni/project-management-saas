import WorkspaceMember from "../models/workspace-member.model.js";
import mongoose from "mongoose"

const create = async (memberData, options = {}) => {
  const [member] = await WorkspaceMember.create([memberData], options);

  return member;
};

const findById = (memberId, options = {}) => {
  return WorkspaceMember.findById(memberId, null, options).populate(
    "user",
    "name email avatar",
  );
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

const findAllByWorkspace = async (workspaceId, filters = {}, options = {}) => {
  const { page = 1, limit = 20, search = "" } = filters;

  const skip = (page - 1) * limit;

  const pipeline = [
    {
      $match: {
        workspace: new mongoose.Types.ObjectId(workspaceId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },

    {
      $unwind: "$user",
    },
    {
      $project: {
        workspace: 1,
        role: 1,
        createdAt: 1,
        updatedAt: 1,
        user: {
          _id: "$user._id",
          name: "$user.name",
          email: "$user.email",
          avatar: "$user.avatar",
        },
      },
    },
  ];

  if (search.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");

    pipeline.push({
      $match: {
        $or: [{ "user.name": searchRegex }, { "user.email": searchRegex }],
      },
    });
  }

  pipeline.push(
    {
      $sort: {
        createdAt: 1,
      },
    },
    {
      $facet: {
        members: [{ $skip: skip }, { $limit: limit }],
        total: [{ $count: "count" }],
      },
    },
  );

  const [result] = await WorkspaceMember.aggregate(pipeline);

  const members = result?.members ?? [];
  const total = result?.total?.[0]?.count ?? 0;
  const totalPages = Math.ceil(total / limit);

  return {
    members,
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

const countByWorkspace = (workspaceId, options = {}) => {
  return WorkspaceMember.countDocuments(
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
  countByWorkspace,
};

export default workspaceMemberRepository;
