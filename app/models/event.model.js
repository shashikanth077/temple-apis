const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {
    name: {
      type: String,
    },
    bookingPrice: {
      type: String,
    },
    organizer: {
      type: String,
    },
    organizerPhone: {
      type: String,
    },
    organizerEmail: {
      type: String,
    },
    startDate: {
      type: String,
    },
    endDate: {
      type: String,
    },
    venue: {
      type: String,
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
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
