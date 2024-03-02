// smsService.js
const twilio = require("twilio");
require("dotenv").config();

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

    console.log(`SMS sent with SID: ${result.sid}`);
    return result.sid;
  } catch (error) {
    console.error("Error sending SMS:", error.message);
    throw error;
  }
};

module.exports = { sendSMS };
