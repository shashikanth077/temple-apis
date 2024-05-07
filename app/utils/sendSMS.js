// smsService.js
const twilio = require("twilio");
require("dotenv").config();
const { logger } = require("../middlewares/logger");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

const client = new twilio(accountSid, authToken);

const sendSMS = async (to, message) => {
  try {
    const result = await client.messages.create({
      body: message,
      from: twilioNumber,
      to: to,
    });
    return result.sid;
  } catch (error) {
    //logger.error("Error sending SMS:", error.message);
  }
};

module.exports = { sendSMS };
