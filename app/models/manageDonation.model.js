const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminDonationTypeSchema = new Schema(
  {
    donationType: {
      type: String
    },
    frequency: {
      type: String
    },
    denominations:{
      type:Array
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    modifiedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin_DonationType", AdminDonationTypeSchema);
