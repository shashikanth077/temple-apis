const UserProfile = require("../../models/user/userProfile.model");
const User = require("../../models/user/user.model");
const FamilyDetails = require("../../models/user/familyDetails.model");
const { logger } = require("../../middlewares");

const getUserProfileByUserId = async (userId) => {
  const user = await User.findOne({ _id: userId, activated: true });
  if (!user) {
    const data = { success: false, message: "User not found" };
    return { data, status: 404 };
  }

  const profile = await UserProfile.findOne({ userId: userId });
  // if (!profile) {
  //   const data = { success: false, message: "User Profile not found" };
  //   return { data, status: 404 };
  // }

  const data = { success: true, profile };

  return { data, status: 200 };
};

const createUserProfile = async (req, res) => {
  const user = await User.findOne({ _id: req.params.userId, activated: true });

  if (!user) {
    const data = { success: false, message: "User not found" };
    return { data, status: 404 };
  }

  const existingProfile = await UserProfile.findOne({ userId: user._id });
  if (existingProfile) {
    const data = {
      success: false,
      message: "Profile already exists for this user",
    };
    return { data, status: 400 };
  }

  const profileData = {
    userId: user._id,
    firstName: user.firstName,
    email: user.email,
    ...req.body,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  };

  await new UserProfile(profileData).save();
  const data = { success: true, message: "User Profile Created successfully" };
  return { data, status: 200 };
};

const updateUserProfile = async (req, res) => {
  const user = await User.findOne({ _id: req.params.userId, activated: true });
  
  if (!user) {
    const data = { success: false, message: "User not found" };
    return { data, status: 404 };
  }

  const existingProfile = await UserProfile.findOne({ userId: user._id });

  // if (!existingProfile) {
  //   const data = {
  //     success: false,
  //     message: "Profile doesn't exists for this user",
  //   };
  //   return { data, status: 404 };
  // }

  const profileData = {
    email: user.email,
    ...req.body,
  };

  const profile = await UserProfile.updateOne(
    { userId: req.params.userId },
    { $set: profileData },
    { runValidators: true, new: true }
  );
  const data = {
    success: true,
    message: "User profile updated successfully",
    profile,
  };

  return { data, status: 200 };
};

const deleteUserAndProfile = async (req, res) => {
  const user = await User.findOne({ _id: req.params.userId, activated: true });
  const deletedUser = await User.findByIdAndDelete(req.params.userId);
  if (!user || !deletedUser) {
    const data = { success: false, message: "User not found" };
    return { data, status: 404 };
  }

  const profile = await UserProfile.deleteOne({ userId: req.params.userId });

  if (!profile) {
    const data = {
      success: false,
      message: "Profile doesn't exists for this user",
    };
    return { data, status: 404 };
  }

  await FamilyDetails.deleteOne({ userId: req.params.userId });

  const data = {
    success: true,
    message: "User profile & family details deleted successfully",
  };

  return { data, status: 200 };
};

module.exports = {
  getUserProfileByUserId,
  createUserProfile,
  updateUserProfile,
  deleteUserAndProfile,
};
