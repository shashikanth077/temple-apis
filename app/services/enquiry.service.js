const Enquiry = require("../models/enquiry.model");

const sendEnquiry = async (req) => {

  const { name, email, subject, message } = req;
  await new Enquiry({
    name: name,
    email: email,
    subject: subject,
    message: message,
    createdAt: Date.now()
  }).save();
 
  //TODO:: Send Email integration

  return { success: true, message: 'Enquiry form submitted successfully' };
};

module.exports = {
    sendEnquiry
};
