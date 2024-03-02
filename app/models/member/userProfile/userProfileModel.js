const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const homeAddressSchema = new Schema({
  address1: String,
  address2: String,
  city: String,
  postalCode: String,
  province: String,
});

const billingAddressSchema = new Schema({
  address1: String,
  address2: String,
  city: String,
  postalCode: String,
  province: String,
});

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

const UserProfileSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: Number,
      required: true,
    },
    homeNumber: {
      type: Number,
    },
    dateOfBirth: {
      type: String,
    },
    nationality: {
      type: String,
    },
    star: {
      type: String,
    },
    gotram: {
      type: String,
    },
    classification: {
      type: String,
    },
    homeAddress: homeAddressSchema,
    billingAddress: billingAddressSchema,
    family: [familySchema],
    deceasedAncestors: [deceasedAncestorsSchema],
    isProfilecreated: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserProfile", UserProfileSchema);
