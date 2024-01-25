const DonationType = require("../../models/manageDonation.model");
const { isNullOrUndefined } = require("../../utils");
const {PUBLIC_URL} = require("../../utils/constants");
const { logger } = require("../../../app/middlewares");

const addDonationType = async (req, res) => {
  
  let denominations = JSON.parse(req.body.denominations);
  if (isNullOrUndefined(req) || isNullOrUndefined(req.body)) {
    const data = { success: false, message: "invalid request" };
    return { data, status: 400 };
  }

  const imagePath = PUBLIC_URL + "uploads/donations/" + req.file.filename;

  // TODO:: update validation
  const donationTypeData = {
    donationType: req.body.donationType,
    frequency: req.body.frequency,
    description: req.body.description,
    denominations:denominations,
    image: imagePath,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  };

  await new DonationType(donationTypeData).save();

  const data = {
    success: true,
    message: "donation type details added successfully",
  };

  return { data, status: 200 };
};

const getDonationTypesByFrequency = async (req) => {

  let donationTypeDetails;
  if (req.body && req.body.frequency) {
    donationTypeDetails = await DonationType.find({
        frequency: req.body.frequency,
    });
  } else {
    donationTypeDetails = await DonationType.find({});
  }

  if (!donationTypeDetails) {
    const data = {
      success: true,
      message: "donation type details doesn't exist",
    };
    return { data, status: 404 };
  } else {
    const data = { success: true, donationTypeDetails };
    return { data, status: 200 };
  }
};

const updateDonationTypeDetails = async (req) => {
  if (
    isNullOrUndefined(req) ||
    isNullOrUndefined(req.body) ||
    isNullOrUndefined(req.params.id)
  ) {
    const data = { success: false, message: "invalid request" };

    return { data, status: 400 };
  }

  const existingDonationType = await DonationType.findOne({ _id: req.params.id });

  if (!existingDonationType) {
    const data = {
      success: false,
      message: "donation type details doesn't exist",
    };
    return { data, status: 404 };
  }

  let denominations = JSON.parse(req.body.denominations);
  req.body.denominations = denominations;

  if (isNullOrUndefined(req.file?.filename)) {
    req.body.image = existingDonationType.image;
  } else {
    const imagePath = PUBLIC_URL + "uploads/donations/" + req?.file?.filename;
    req.body.image = imagePath;
  }

  const result = await DonationType.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { runValidators: true, new: true }
  );
  const data = {
    success: true,
    message: "donation type details updated successfully",
    result,
  };

  return { data, status: 200 };
};

const deleteDonationTypeDetails = async (req) => {
  if (isNullOrUndefined(req) || isNullOrUndefined(req.params.id)) {
    const data = { success: false, message: "invalid request" };

    return { data, status: 400 };
  }

  const existingDonationType = await DonationType.findOne({ _id: req.params.id });

  if (!existingDonationType) {
    const data = {
      success: false,
      message: "donation type details doesn't exist",
    };

    return { data, status: 404 };
  }

  await DonationType.deleteOne({ _id: req.params.id });
  const data = {
    success: true,
    message: "donation type details deleted successfully",
  };

  return { data, status: 200 };
};

const getDonationTypeDetailsById = async (req, res) => {
  if (isNullOrUndefined(req) || isNullOrUndefined(req.params.id)) {
    const data = { success: false, message: "invalid request" };
    return { data, status: 400 };
  }
  const donationType = await DonationType.findOne({ _id: req.params.id });

  if (!donationType) {
    const data = { success: false, message: "donation type details not found" };
    return { data, status: 404 };
  }

  const data = { success: true, donationType };

  return { data, status: 200 };
};

module.exports = {
    addDonationType,
    getDonationTypesByFrequency,
    updateDonationTypeDetails,
    deleteDonationTypeDetails,
    getDonationTypeDetailsById,
};
