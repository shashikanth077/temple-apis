const DeceasedDetails = require("../../models/user/deceasedDetails.model");
const User = require("../../models/user/user.model");
const { logger } = require("../../middlewares");

const getDeceasedDetailsByUserId = async (req) => {

  const user = await User.findOne({ _id: req.params.userId, activated: true });
  if (!user) {
    const data = { success: false, message: "User not found" };
    return { data, status: 404 };
  }

  const deceased = await DeceasedDetails.findOne({ userId: req.params.userId,_id:req.params.id });
  if (!deceased) {
    const data = {
      success: true,
      deceased,
      message: "User Deceased not available",
    };
    return { data, status: 200 };
  }

  const data = { success: true, deceased };

  return { data, status: 200 };
};

const getDeceasedListByUserId = async (req) => {

  const user = await User.findOne({ _id: req.params.userId, activated: true });
  if (!user) {
    const data = { success: false, message: "User not found" };
    return { data, status: 404 };
  }

  const deceasedlist = await DeceasedDetails.find({ userId: req.params.userId });
  if (!deceasedlist) {
    const data = {
      success: true,
      families:DeceasedDetails,
      message: "User Deceased not available",
    };
    return { data, status: 200 };
  }

  const data = { success: true, deceasedlist };
  return { data, status: 200 };
};

const createDeceasedDetails = async (req, res) => {
  const user = await User.findOne({ _id: req.params.userId, activated: true });

  if (!user) {
    const data = { success: false, message: "User not found" };
    return { data, status: 404 };
  }

  const DeceasedData = {
    userId: user._id,
    ...req.body,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  };

  await new DeceasedDetails(DeceasedData).save();

  const data = {
    success: true,
    message: "Deceased Details Created successfully",
  };

  return { data, status: 200 };
};

const updateDeceasedDetails = async (req, res) => {
  const user = await User.findOne({ _id: req.params.userId, activated: true });
  if (!user) {
    const data = { success: false, message: "User not found" };
    return { data, status: 404 };
  }

  if (!req.params.deceasedId) {
    const data = {
      success: false,
      message: "Deceased detail invalid for this user",
    };
    return { data, status: 404 };
  }

  const existingDeceasedId = await DeceasedDetails.findOne({
    _id: req.params.deceasedId,
  });

  if (!existingDeceasedId || existingDeceasedId === null) {
    const data = {
      success: false,
      message: "Deceased Details doesn't exists for this user",
    };
    return { data, status: 404 };
  }

  const DeceasedData = {
    ...req.body,
  };

  const DeceasedList = await DeceasedDetails.findByIdAndUpdate(
    req.params.deceasedId,
    { $set: DeceasedData },
    { runValidators: true, new: true }
  );
  const data = {
    success: true,
    message: "DeceasedDetails updated successfully",
  };
  return { data, status: 200 };
};

const deleteDeceasedDetails = async (req, res) => {
  const user = await User.findOne({ _id: req.params.userId, activated: true });

  if (!user) {
    const data = { success: false, message: "User not found" };
    return { data, status: 404 };
  }

  if (!req.params.deceasedId) {
    const data = {
      success: false,
      message: "Deceased detail invalid for this user",
    };
    return { data, status: 404 };
  }

  const existingDeceasedId = await DeceasedDetails.findOne({
    _id: req.params.deceasedId,
  });

  if (!existingDeceasedId || existingDeceasedId === null) {
    const data = {
      success: false,
      message: "Deceased Details doesn't exists for this user",
    };
    return { data, status: 404 };
  }

  const Deceased = await DeceasedDetails.deleteOne({ _id: req.params.deceasedId });

  if (!Deceased) {
    const data = {
      success: false,
      message: "Deceased details doesn't exists",
    };
    return { data, status: 404 };
  }

  const data = {
    success: true,
    message: "Deceased Details deleted successfully",
  };

  return { data, status: 200 };
};

module.exports = {
  getDeceasedDetailsByUserId,
  createDeceasedDetails,
  updateDeceasedDetails,
  deleteDeceasedDetails,
  getDeceasedListByUserId
};
