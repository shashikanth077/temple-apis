const { logger } = require("../middlewares/logger");
const validator = require('validator');

const {
    sendEnquiry
  } = require("../services/enquiry.service");

exports.sendEnquiryController = async (req, res, next) => {

    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message || !validator.isEmail(email)) {
            return res.status(400).json({ error: 'Invalid request payload' });
        }

        // TODO: add email validation
        const sendEnquiryService = await sendEnquiry(
            req.body,
          );
          
          return res.status(200).json(sendEnquiryService);
    } catch (error) {
        logger.error('Enquiry Error:', error);
        res.status(500).json({ error: 'Internal server error (Enquiry)' });
    }
  };
  