import User from "../models/user.model.js";

const findUserByEmail = (email, options = {}) => {
  return User.findOne({ email }, null, options);
};

const findUserByEmailWithPassword = (email, options = {}) => {
  return User.findOne({ email }, null, options).select("+password");
};

const findUserById = (id, options = {}) => {
  return User.findById(id, null, options);
};

const findUserByIdWithRefreshToken = (id, options = {}) => {
  return User.findById(id, null, options).select("+refreshToken");
};

const createUser = async (userData, options = {}) => {
  const [user] = await User.create([userData], options);

  return user;
};

const updateRefreshToken = (userId, refreshToken, options = {}) => {
  return User.findByIdAndUpdate(
    userId,
    { refreshToken },
    {
      returnDocument: "after",
      ...options,
    },
  );
};

const clearRefreshToken = (userId, options = {}) => {
  return User.findByIdAndUpdate(
    userId,
    {
      refreshToken: null,
    },
    {
      returnDocument: "after",
      ...options,
    },
  );
};

const updatePasswordResetToken = (
  userId,
  hashedToken,
  passwordResetExpires,
  options = {},
) => {
  return User.findByIdAndUpdate(
    userId,
    {
      passwordResetToken: hashedToken,
      passwordResetExpires,
    },
    {
      returnDocument: "after",
      ...options,
    },
  );
};

const findUserByPasswordResetToken = (passwordResetToken, options = {}) => {
  return User.findOne(
    {
      passwordResetToken,
      passwordResetExpires: { $gt: Date.now() },
    },
    null,
    options,
  );
};

const userRepository = {
  findUserByEmail,
  findUserByEmailWithPassword,
  findUserById,
  findUserByIdWithRefreshToken,
  createUser,
  updateRefreshToken,
  clearRefreshToken,
  updatePasswordResetToken,
  findUserByPasswordResetToken,
};

export default userRepository;
