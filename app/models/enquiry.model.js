/*
{
	"name": "string",
	"email": "string",
	"subject": "plain text",
	"message": "<html></html>"
}
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const enquirySchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  subject: {
    type: String
  },
  message: {
    type: String
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  }
});

module.exports = mongoose.model("Enquiry", enquirySchema);
