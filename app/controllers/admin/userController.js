const { logger } = require("../../middlewares");
const { generateRandomPassword } = require("../../utils/index");

const db = require("../../models/auth");
const User = db.user;
const Role = db.role;
const Counter = require("../../models/member/userProfile/counterModel");

var bcrypt = require("bcryptjs");
const Email = require("../../utils/sendEmail");

const {
  getAllUsers,
  getUserByUserId,
  updateUserRole,
  activateOrDeActivateUserByUserId,
} = require("../../services/admin/userService");

exports.getAllUsers = async (req, res) => {
  try {
    const result = await getAllUsers();
    return res.status(result.status).json(result.data);
  } catch (error) {
    logger.error("getAllUsers Error:", error);
    res.status(500).json({ error: "Internal server error (getAllUsers)" });
  }
};

exports.getUserByUserId = async (req, res) => {
  try {
    const result = await getUserByUserId(req.params.userId);
    return res.status(result.status).json(result.data);
  } catch (error) {
    logger.error("getUserByUserId Error:", error);
    res.status(500).json({ error: "Internal server error (getUserByUserId)" });
  }
};

exports.addUserByAdmin = async (req, res) => {
  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "devoteeId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    let ranPass = generateRandomPassword();

    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      devoteeId: counter.seq,
      countrycode: req.body.countrycode,
      TermConcent: true,
      phonenumber: req.body.countrycode + "" + req.body.phonenumber,
      password: bcrypt.hashSync(ranPass, 8),
      activated: true,
    });

    let emailObject = {
      name: req.body.firstName + "" + req.body.lastName,
      email: req.body.email,
      bodyData: {
        password: ranPass,
        phonenumber: req.body.countrycode + "" + req.body.phonenumber,
      },
    };

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
              SendConfirmationEmail(emailObject, "");
              res.send({
                success: true,
                message:
                  "User has registered and initial password has been sent to user for login",
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
            SendConfirmationEmail(emailObject, "");
            res.send({
              success: true,
              message:
                "User has registered and initial password has been sent to user for login",
            });
          });
        });
      }
    });
  } catch (error) {
    logger.error("getUserByUserId Error:", error);
    res.status(500).json({ error: "Internal server error (addUserByAdmin)" });
  }
};

const SendConfirmationEmail = async (user, activationLink) => {
  new Email(
    user,
    activationLink,
    "admin registration for user"
  ).adminRegistrationConfirm();
};

exports.updateUserRole = async (req, res) => {
  try {
    const result = await updateUserRole(req);
    return res.status(result.status).json(result.data);
  } catch (error) {
    logger.error("updateUserRole Error:", error);
    res.status(500).json({
      error: "Something went wrong please try again (updateUserRole)",
    });
  }
};

exports.activateOrDeActivateUserByUserId = async (req, res) => {
  try {
    const result = await activateOrDeActivateUserByUserId(req);
    return res.status(result.status).json(result.data);
  } catch (error) {
    logger.error("activateOrDeActivateUserByUserId Error:", error);
    res.status(500).json({
      error:
        "Something went wrong please try again (activateOrDeActivateUserByUserId)",
    });
  }
};
