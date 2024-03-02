const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminSevaBookingSchema = new Schema(
  {
    sevaBookingType: {
      type: String,
    },
    category: {
      type: String,
    },
    name: {
      type: String,
    },
    amount: {
      type: Number,
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

module.exports = mongoose.model("Admin_SevaBooking", AdminSevaBookingSchema);
