const UserProfile = require("../../../models/member/userProfile/userProfileModel");
const FamilyDetails = require("../../../models/member/userProfile/familyDetailsModel");
const User = require("../../../models/auth/userModel");
const bcrypt = require("bcryptjs");

const getUserProfileByUserId = async (userId) => {
  const user = await User.findOne({ _id: userId, activated: true });
  if (!user) {
    const data = { success: false, message: "User not found" };
    return { data, status: 404 };
  }

  const profile = await UserProfile.findOne({ userId: userId });
  if (!profile?.isProfilecreated) {
    const data = { success: false, message: "Please update the profile" };
    return { data, status: 500 };
  } else {
    const data = { success: true, profile };
    return { data, status: 200 };
  }
};

const updatePassword = async (req) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findOne({ _id: req.params.userId, activated: true });
  if (!user) {
    const data = { success: false, message: "User not found" };
    return { data, status: 404 };
  }

  const passwordIsValid = bcrypt.compareSync(
    oldPassword,
    user.password
  );

  if (!passwordIsValid) {
    const data = {
      success: false,
      message: "Invalid password",
    };
    return { data, status: 401 };
  }

  user.password = bcrypt.hashSync(newPassword, 8);
  await user.save();

  const data = {
    success: true,
    message: "Password changed successfully!",
  };
  return { data, status: 200 };
};

const createUserProfile = async (req, res) => {
  const user = await User.findOne({ _id: req.params.userId, activated: true });

  if (!user) {
    const data = { success: false, message: "User not found" };
    return { data, status: 404 };
  }

  const existingProfile = await UserProfile.findOne({ userId: user._id });
  req.body.isProfilecreated = true;

  if (existingProfile) {
    const profileData = {
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
  } else {
    const profileData = {
      userId: user._id,
      firstName: user.firstName,
      email: user.email,
      ...req.body,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    };

    await new UserProfile(profileData).save();
    const data = {
      success: true,
      message: "User Profile Created successfully",
    };
    return { data, status: 200 };
  }
};

const updateUserProfile = async (req, res) => {
  const user = await User.findOne({ _id: req.params.userId, activated: true });

  if (!user) {
    const data = { success: false, message: "User not found" };
    return { data, status: 404 };
  }

  const profileData = {
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
  updatePassword,
};
