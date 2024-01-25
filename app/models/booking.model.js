const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    bookingId: {
        type: String,
        required: true
    },
    category: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    comments: {
      type: String,
    },
    bookingDate: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    modifiedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);
