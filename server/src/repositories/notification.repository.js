import Notification from "../models/notification.model.js";

const create = async (notificationData, options = {}) => {
  const [notification] = await Notification.create([notificationData], options);

  return notification;
};

const findById = (notificationId, options = {}) => {
  return Notification.findById(notificationId, null, options).populate(
    "actor",
    "name",
  );
};

const [notifications, total, unreadCount, allCount] = await Promise.all([
  Notification.find(query, null, options)
    .populate("actor", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit),

  Notification.countDocuments(query),

  Notification.countDocuments({
    recipient: recipientId,
    read: false,
  }),

  Notification.countDocuments({
    recipient: recipientId,
  }),
]);

return {
  notifications,
  unreadCount,
  allCount,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  },
};

const updateById = (notificationId, updateData, options = {}) => {
  return Notification.findByIdAndUpdate(notificationId, updateData, {
    new: true,
    ...options,
  });
};

const markAllAsRead = (recipientId, options = {}) => {
  return Notification.updateMany(
    {
      recipient: recipientId,
      read: false,
    },
    {
      read: true,
    },
    options,
  );
};

const deleteById = (notificationId, options = {}) => {
  return Notification.findByIdAndDelete(notificationId, options);
};

const notificationRepository = {
  create,
  findById,
  findAllByRecipient,
  updateById,
  markAllAsRead,
  deleteById,
};

export default notificationRepository;
