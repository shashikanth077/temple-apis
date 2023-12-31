const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const familySchema = new Schema({
  relationship: String,
  firstName: String,
  lastName: String,
  email: String,
  mobileNumber: String,
  homeNumber: String,
  dateOfBirth: String,
  nationality: String,
  star: String,
  gotram: String,
  language: String,
});

const deceasedAncestorsSchema = new Schema({
  relationship: String,
  personName: String,
  deathDate: String,
  deathTime: String,
  placeOfDeath: String,
  paksha: String,
  masam: String,
  star: String,
  gotram: String,
  language: String,
  tithi: String,
  tithiDetails: String,
});

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
    family: familySchema,
    deceasedAncestors: deceasedAncestorsSchema,
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("familyDetails", FamilyDetailsSchema);
