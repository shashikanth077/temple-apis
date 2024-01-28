const { logger } = require("../middlewares/logger");
const validator = require('validator');
const Email = require('./../utils/sendEmail');

const {
    sendEnquiry
  } = require("../services/enquiry.service");

exports.sendEnquiryController = async (req, res, next) => {

    try {
        const { name, email, message,subject } = req.body;

        if (!name || !email || !message || !validator.isEmail(email)) {
            return res.status(400).json({ error: 'Invalid request payload' });
        }

        const sendEnquiryService = await sendEnquiry(
            req.body,
        );
          
        let emailbody = {
           email : "shashikanth033@gmail.com",
           message:message,
           subject:subject,
           name:name
        }

        new Email(emailbody, '','enquiry notification').sendEnquiry(); 
        return res.status(200).json(sendEnquiryService);
    } catch (error) {
        logger.error('Enquiry Error:', error);
        res.status(500).json({success:false, error: 'Internal server error (Enquiry)' });
    }
  };
  