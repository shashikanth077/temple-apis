const User = require("../../models/user/user.model");
const MasterDonation = require("../../models/donations/manageDonation.model");
const Donation = require("../../models/donations/donation.model");
const AdminTranscationModel = require("../../models/bookingHistory/adminTranscation.model");

const {
  isNullOrUndefined,
  generateUniqueNumber,
} = require("../../utils/index");
const { logger } = require("../../middlewares");
const { sendSMS } = require("../../utils/sendSMS");
const Email = require('../../utils/sendEmail');

const addDonationDetails = async (req, res) => {
  if (
    isNullOrUndefined(req) ||
    isNullOrUndefined(req.body) ||
    isNullOrUndefined(req.params.userId)
  ) {
    const data = { success: false, message: "invalid request" };
    return { data, status: 400 };
  }

  const isValidDonationTypes =
    req && req.body && !isNullOrUndefined(req.body.donationType);

  if (!isValidDonationTypes) {
    const data = { success: false, message: "invalid donationType in request" };
    return { data, status: 400 };
  }

  const user = await User.findOne({ _id: req.params.userId, activated: true });
  const donationTypeDetails = await MasterDonation.findOne({
    _id: req.body.donateTypeId,
  });

  if (!user) {
    const data = { success: false, message: "User not found" };
    return { data, status: 404 };
  }

  if (!donationTypeDetails) {
    const data = { success: false, message: "No donation type found" };
    return { data, status: 404 };
  }

  //when donate grocery items this come to picture or else by default zero price
  let totalPrice = 0;
  if (
    !isNullOrUndefined(req.body.donatedItems) &&
    req.body.donatedItems.length > 0
  ) {
    req.body.donatedItems.forEach((item) => {
      totalPrice += item.price;
    });
  }

  //send email and sms success or failur
  const toPhoneNumber = "+918123192799"; // Replace with the recipient's phone number
    
  let message ;
  if(req.body.transStatus === 'succeeded') {
    message ='Payment was successfull. Thank you for donating to '+req.body.donationType
  } else {
    message ='Payment was unsuccessfull. If amount debited it will refund to same account withing 3 to 4 days'
  }

  let taxReceipt = generateUniqueNumber();
  const messageText = `Hello ${req.body.donorName}. ${message}. Receipt no:${taxReceipt}`;
  sendSMS(toPhoneNumber, messageText);

  let EmailObject = {
    name : req.body.donorName,
    email:req.body.donorEmail,
    message:message,
    bodyData:req.body,
    url:"http://localhost:3000/mydonations/list"
  }

  SendConfirmationEmail(EmailObject, '');

  const donationDetails = {
    userId: user._id,
    donateTypeId:donationTypeDetails?._id,
    donationType: req.body.donationType,
    devoteeName: req.body.donorName,
    devoteeId: req.body.devoteeId,
    devoteeEmail: req.body.donorEmail,
    frequency: req.body.frequency,
    devoteePhoneNumber: req.body.donorPhoneNumber,
    orderNotes: req.body.donorNotes,
    billingAddress: req.body.billingAddress,
    stripeReferenceId: req.body.stripeReferenceId,
    amount: req.body.donatedAmount,
    transStatus: req.body.transStatus,
    paymentMode: req.body.paymentMode,
    taxReceiptNo: taxReceipt,
    donationDate: Date.now(),
    donatedItems: req.body.donatedItems,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  };
  
  const donationHistory = new Donation(donationDetails);
  const savedDonate = await donationHistory.save();
  const lastInsertedId = savedDonate._id;
  
  const adminTransData = {
    userId: user._id,
    tabelRefId:lastInsertedId,
    orderType:"donations",
    serviceName: req.body.donationType,
    devoteeName: req.body.donorName,
    devoteeId: req.body.devoteeId,
    devoteeEmail: req.body.donorEmail,
    devoteePhoneNumber: req.body.donorPhoneNumber,
    orderNotes: req.body.donorNotes,
    billingAddress: req.body.billingAddress,
    stripeReferenceId: req.body.stripeReferenceId,
    amount: req.body.donatedAmount,
    transStatus: req.body.transStatus,
    paymentMode: req.body.paymentMode,
    ticketId: taxReceipt,
    items: req.body.donatedItems,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  };

  await AdminTranscationModel.create(adminTransData);

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

  const donations = await Donation.find({ userId: req.params.userId });

  if (!donations) {
    const data = { success: false, message: "Donation details not found" };
    return { data, status: 404 };
  }

  const data = { success: true, donations };

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

const SendConfirmationEmail = async (user, activationLink) => {
  new Email(user, activationLink, "donation email book").donationConfirmation();
};


module.exports = {
  addDonationDetails,
  getDonationDetailsByUserId,
  getDonationDetailsByDonationId,
};
