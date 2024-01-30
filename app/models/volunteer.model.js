const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VoluteersSchema = new Schema(
  {
    beforevolunteer: {
        type: Boolean,
        required: true
    },
    description: {
      type: String,
    },
    email: {
      type: String,
      required: true
    },
    islive: {
      type: Boolean,
      required: true
    },
    isveg: {
      type: Boolean,
      required: true
    },
    iswhatsupnumber: {
      type: Boolean,
    },
    name: {
      type: String,
      required: true
    },
    phone: {
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

module.exports = mongoose.model("Volunteers", VoluteersSchema);
