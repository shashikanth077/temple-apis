const Enquiry = require("../../models/member/enquiryModel");

const sendEnquiry = async (req) => {
  const { name, email, subject, message } = req;
  await new Enquiry({
    name: name,
    email: email,
    subject: subject,
    message: message,
    createdAt: Date.now(),
  }).save();
  return { success: true, message: "Enquiry form submitted successfully" };
};

module.exports = {
  sendEnquiry,
};
