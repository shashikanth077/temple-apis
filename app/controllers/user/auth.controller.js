const config = require("../../config/auth.config");
const db = require("../../models/user");
const User = db.user;
const Role = db.role;
const UserProfile = require("../../models/user/userProfile.model");
const Counter = require("../../models/counter.model");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Email = require("../../utils/sendEmail");
const { sendSMS } = require("../../utils/sendSMS");

const {
  requestPasswordReset,
  resetPassword,
  generateandSaveOTP,
  VerifyOTP,
} = require("../../services/user/auth.service");

exports.signup = async (req, res) => {
  // Generate a random activation token
  const activationToken = crypto.randomBytes(20).toString("hex");
  const clientURL = process.env.CLIENT_URL;
  const activationLink = `${clientURL}/useractivation/${activationToken}`;
  const activationTokenExpiry = new Date();
  activationTokenExpiry.setHours(activationTokenExpiry.getHours() + 24); // Set expiration to 24 hour from now

  const counter = await Counter.findByIdAndUpdate(
    { _id: "devoteeId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    devoteeId: counter.seq,
    countrycode: req.body.countrycode,
    TermConcent: req.body.TermConcent,
    phonenumber: req.body.countrycode + "" + req.body.phonenumber,
    password: bcrypt.hashSync(req.body.password, 8),
    activationToken: activationToken,
    activationTokenExpiry: activationTokenExpiry,
    activated: false,
  });

  try {
    user.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user.firstName) {
        res.status(500).send({ message: "First Name is required" });
        return;
      }

      if (req.body.roles) {
        Role.find(
          {
            name: { $in: req.body.roles },
          },
          (err, roles) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            user.roles = roles.map((role) => role._id);
            user.save((err) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
              let mobileNumber =  req.body.countrycode + "" + req.body.phonenumber;
              SendOTP(mobileNumber);
              SendAccountActivationEmail(user, activationLink);
              res.send({
                success: true,
                message:
                  "User was registered successfully! Activation email sent to your registered email and it expires in 24 hours",
              });
            });
          }
        );
      } else {
        Role.findOne({ name: "user" }, (err, role) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = [role._id];
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            let mobileNumber = req.body.countrycode + "" + req.body.phonenumber;
            SendOTP(mobileNumber);
            SendAccountActivationEmail(user, activationLink);
            res.send({
              success: true,
              message:
                "User was registered successfully! Activation email sent. Please check your email.",
            });
          });
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.activateEmail = async (req, res) => {
  try {
    const { token } = req.params;
    // Find the user by activation token
    const user = await User.findOne({
      activationToken: token,
      activationTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res
        .status(404)
        .send({
          success: false,
          message: "Invalid or expired activation token",
        });
    }

    // Activate the user
    user.activated = true;
    user.IsEmailActive = true;
    user.activationToken = undefined;

    const profileData = {
      userId: user._id,
      firstName: user.firstName,
      countryCode: req.body.countrycode,
      lastName: user.lastName,
      mobileNumber: user.phonenumber,
      email: user.email,
      ...req.body,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    };

    await new UserProfile(profileData).save();

    await user.save();

    return res.send({
      success: true,
      message: "Account activated successfully!",
    });
  } catch (err) {
    //this.next(err);
    console.log(err);
    return res.status(500).send({
      success: false,
      message: "something went wrong (activateEmail)",
    });
  }
};

exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ success: false, message: err });
        return;
      }

      if (!user) {
        return res
          .status(404)
          .send({ success: false, message: "User Not found." });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res
          .status(401)
          .send({ success: false, message: "Invalid Password!" });
      }

      if (!user.activated) {
        return res
          .status(401)
          .send({ success: false, message: "Account Not Activated" });
      }

      const token = jwt.sign({ id: user.id }, config.secret, {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      });

      const authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }

      req.session.token = token;

      res.status(200).send({
        id: user._id,
        email: user.email,
        firstName:user.firstName,
        lastName:user.lastName,
        userName: user.firstName + "" + user.lastName,
        countrycode: user.countrycode,
        devoteeId: user.devoteeId,
        phonenumber: user.phonenumber,
        roles: authorities,
        success: true,
        message: "login successful",
      });
    });
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};

exports.resetPasswordRequestController = async (req, res, next) => {
  const requestPasswordResetService = await requestPasswordReset(
    req.body.email
  );
  return res
    .status(requestPasswordResetService.status)
    .json(requestPasswordResetService.data);
};

exports.resetPasswordController = async (req, res, next) => {
  const resetPasswordService = await resetPassword(
    req.body.userid,
    req.body.identifier,
    req.body.password
  );
  return res
    .status(resetPasswordService.status)
    .send({
      success: resetPasswordService.success,
      message: resetPasswordService.message,
    });
};

exports.getOTP = async (req, res) => {
  try {
    const result = await generateandSaveOTP(req.body.phoneNumber);

    const toPhoneNumber = "+918123192799";
    let message = "Please enter the below otp:";

    const messageText = `Hello ${message}. OTP:${result.data.otp}`;
    sendSMS(toPhoneNumber, messageText);

    return res.status(result.status).json(result.data);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Something went wrong please try again (getOTP)",
    });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const result = await VerifyOTP(req.body.phoneNumber, req.body.otp);
    return res.status(result.status).json(result.data);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Something went wrong please try again (verifyOTP)",
    });
  }
};

const SendAccountActivationEmail = async (user, activationLink) => {
  new Email(user, activationLink, "email activation").verifyEmailAddress();
};

const SendOTP = async (mobileNumber) => {
  try {
    const result = await generateandSaveOTP(mobileNumber);

    let message = "Please enter the below OTP";

    const messageText = `Hello ${message}.:${result.data.otp}`;
    return sendSMS(mobileNumber, messageText);
  } catch (error) {
    console.log(error);
  }
};
