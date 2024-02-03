const FamilyDetails = require("../../models/user/familyDetails.model");
const User = require("../../models/user/user.model");
const { logger } = require("../../middlewares");

const getFamilyDetailsByUserId = async (req) => {

  const user = await User.findOne({ _id: req.params.userId, activated: true });
  if (!user) {
    const data = { success: false, message: "User not found" };
    return { data, status: 404 };
  }

  const familyDetails = await FamilyDetails.findOne({ userId: req.params.userId,_id:req.params.id });
  if (!familyDetails) {
    const data = {
      success: true,
      family,
      message: "User family not available",
    };
    return { data, status: 200 };
  }

  const data = { success: true, familyDetails };

  return { data, status: 200 };
};

const getFamilyListByUserId = async (req) => {

  const user = await User.findOne({ _id: req.params.userId, activated: true });
  if (!user) {
    const data = { success: false, message: "User not found" };
    return { data, status: 404 };
  }

  const familyDetails = await FamilyDetails.find({ userId: req.params.userId });
  if (!familyDetails) {
    const data = {
      success: true,
      families:familyDetails,
      message: "User family not available",
    };
    return { data, status: 200 };
  }

  const data = { success: true, familyDetails };
  return { data, status: 200 };
};

const createFamilyDetails = async (req, res) => {
  const user = await User.findOne({ _id: req.params.userId, activated: true });

  if (!user) {
    const data = { success: false, message: "User not found" };
    return { data, status: 404 };
  }

  const familyData = {
    userId: user._id,
    ...req.body,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  };

  await new FamilyDetails(familyData).save();

  const data = {
    success: true,
    message: "Family Details Created successfully",
  };

  return { data, status: 200 };
};

const updateFamilyDetails = async (req, res) => {
  const user = await User.findOne({ _id: req.params.userId, activated: true });
  if (!user) {
    const data = { success: false, message: "User not found" };
    return { data, status: 404 };
  }

  if (!req.params.familyId) {
    const data = {
      success: false,
      message: "family detail invalid for this user",
    };
    return { data, status: 404 };
  }

  const existingFamilyId = await FamilyDetails.findOne({
    _id: req.params.familyId,
  });

  if (!existingFamilyId || existingFamilyId === null) {
    const data = {
      success: false,
      message: "Family Details doesn't exists for this user",
    };
    return { data, status: 404 };
  }

  const familyData = {
    ...req.body,
  };

  const familyDetails = await FamilyDetails.findByIdAndUpdate(
    req.params.familyId,
    { $set: familyData },
    { runValidators: true, new: true }
  );
  const data = {
    success: true,
    message: "FamilyDetails updated successfully",
  };
  return { data, status: 200 };
};

const deleteFamilyDetails = async (req, res) => {
  const user = await User.findOne({ _id: req.params.userId, activated: true });

  if (!user) {
    const data = { success: false, message: "User not found" };
    return { data, status: 404 };
  }

  if (!req.params.familyId) {
    const data = {
      success: false,
      message: "family detail invalid for this user",
    };
    return { data, status: 404 };
  }

  const existingFamilyId = await FamilyDetails.findOne({
    _id: req.params.familyId,
  });

  if (!existingFamilyId || existingFamilyId === null) {
    const data = {
      success: false,
      message: "Family Details doesn't exists for this user",
    };
    return { data, status: 404 };
  }

  const family = await FamilyDetails.deleteOne({ _id: req.params.familyId });

  if (!family) {
    const data = {
      success: false,
      message: "Family details doesn't exists",
    };
    return { data, status: 404 };
  }

  const data = {
    success: true,
    message: "Family Details deleted successfully",
  };

  return { data, status: 200 };
};

module.exports = {
  getFamilyDetailsByUserId,
  createFamilyDetails,
  updateFamilyDetails,
  deleteFamilyDetails,
  getFamilyListByUserId
};
