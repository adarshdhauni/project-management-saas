import User from "../models/User.js";

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
  return User.findByIdAndUpdate(userId, { refreshToken }, { new: true });
};

const userRepository = {
  findUserByEmail,
  createUser,
  findUserById,
  updateRefreshToken,
  findUserByEmailWithPassword,
};

export default userRepository;
