import User from "../models/user.model.js";

const findUserByEmail = (email) => {
  return User.findOne({ email });
};

const findUserByEmailWithPassword = (email) => {
  return User.findOne({ email }).select("+password");
};

const findUserById = (id) => {
  return User.findById(id);
};

const findUserByIdWithRefreshToken = (id) => {
  return User.findById(id).select("+refreshToken");
};

const createUser = (userData) => {
  return User.create(userData);
};

const updateRefreshToken = (userId, refreshToken) => {
  return User.findByIdAndUpdate(
    userId,
    { refreshToken },
    { returnDocument: "after" },
  );
};

const clearRefreshToken = async (userId) => {
  await User.findByIdAndUpdate(
    userId,
    {
      refreshToken: null,
    },
    {
      returnDocument: "after",
    },
  );
};

const updatePasswordResetToken = (
  userId,
  hashedToken,
  passwordResetExpires,
) => {
  return User.findByIdAndUpdate(
    userId,
    {
      passwordResetToken: hashedToken,
      passwordResetExpires,
    },
    { returnDocument: "after" },
  );
};

const findUserByPasswordResetToken = (passwordResetToken) => {
  return User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });
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
