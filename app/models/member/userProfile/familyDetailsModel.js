const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FamilyDetailsSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserProfile",
    },
    relationship: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    dateOfBirth: {
      type: String,
    },
    star: {
      type: String,
    },
    gotram: {
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

module.exports = mongoose.model("familyDetails", FamilyDetailsSchema);
