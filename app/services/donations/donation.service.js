const User = require("../models/user/user.model");
const UserProfile = require("../models/user/userProfile.model");
const Donation = require("../models/donations/donation.model");
const { allowedDonationTypes } = require("../../utils/constants");
const { isNullOrUndefined, concatenateNames } = require("../../utils/index");
const { logger } = require("../../middlewares");

const addDonationDetails = async (req, res) => {
  if (
    isNullOrUndefined(req) ||
    isNullOrUndefined(req.body) ||
    isNullOrUndefined(req.params.userId) ||
    isNullOrUndefined(req.body.isSameAsHomeAddress)
  ) {
    const data = { success: false, message: "invalid request" };
    return { data, status: 400 };
  }

  const isValidDonationTypes =
    req &&
    req.body &&
    !isNullOrUndefined(req.body.donationType) &&
    allowedDonationTypes.includes(req.body.donationType);

  if (!isValidDonationTypes) {
    const data = { success: false, message: "invalid donationType in request" };
    return { data, status: 400 };
  }

  const user = await User.findOne({ _id: req.params.userId, activated: true });

  if (!user) {
    const data = { success: false, message: "User not found" };
    return { data, status: 404 };
  }

  let homeAddress = {};
  if (req.body.isSameAsHomeAddress === true) {
    const profile = await UserProfile.findOne({ userId: req.params.userId });
    if (!profile) {
      const data = { success: false, message: "User Profile not found" };
      return { data, status: 404 };
    } else {
      if (profile.homeAddress) {
        homeAddress = {
          address1: profile.homeAddress.address1,
          address2: profile.homeAddress.address2,
          city: profile.homeAddress.city,
          postalCode: profile.homeAddress.postalCode,
          province: profile.homeAddress.province,
          phone: profile.mobileNumber,
        };
      } else {
        homeAddress = null;
      }
    }
  }

  let totalPrice = 0;
  if (
    !isNullOrUndefined(req.body.donatedItems) &&
    req.body.donatedItems.length > 0
  ) {
    req.body.donatedItems.forEach((item) => {
      totalPrice += item.price;
    });
  }

  const donationData = {
    userId: user._id,
    donor: concatenateNames(user.firstName, user.lastName),
    donationType: req.body.donationType,
    donationDate: isNullOrUndefined(req.body.donationDate)
      ? Date.now()
      : req.body.donationDate,
    totalDonationAmount: totalPrice > 0 ? totalPrice : null,
    donatedItems: req.body.donatedItems,
    address:
      req.body.isSameAsHomeAddress === true ? homeAddress : req.body.address,
    isSameAsHomeAddress: req.body.isSameAsHomeAddress,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  };

  await new Donation(donationData).save();

  const data = {
    success: true,
    message: "Donation details added successfully",
  };

  return { data, status: 200 };
};

const getDonationDetailsByUserId = async (req, res) => {
  if (isNullOrUndefined(req) || isNullOrUndefined(req.params.userId)) {
    const data = { success: false, message: "invalid request" };
    return { data, status: 400 };
  }

  const user = await User.findOne({ _id: req.params.userId, activated: true });
 
  if (!user) {
    const data = { success: false, message: "User not found" };
    return { data, status: 404 };
  }

  const donationDetails = await Donation.find({ userId: req.params.userId });

  if (!donationDetails) {
    const data = { success: false, message: "Donation details not found" };
    return { data, status: 404 };
  }

  const data = { success: true, donationDetails };

  return { data, status: 200 };
};

const getDonationDetailsByDonationId = async (req, res) => {
  if (
    isNullOrUndefined(req) ||
    isNullOrUndefined(req.params.donationId) ||
    isNullOrUndefined(req.params.userId)
  ) {
    const data = { success: false, message: "invalid request" };
    return { data, status: 400 };
  }

  const user = await User.findOne({ _id: req.params.userId, activated: true });

  if (!user) {
    const data = { success: false, message: "User not found" };
    return { data, status: 404 };
  }

  const donationDetails = await Donation.find({ _id: req.params.donationId });

  if (!donationDetails) {
    const data = { success: false, message: "Donation details not found" };
    return { data, status: 404 };
  }

  const data = { success: true, donationDetails };

  return { data, status: 200 };
};

module.exports = {
  addDonationDetails,
  getDonationDetailsByUserId,
  getDonationDetailsByDonationId,
};
