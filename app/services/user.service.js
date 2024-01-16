const User = require("../models/user.model");
const Role = require("../models/role.model");
const { allowedUserRoles } = require("../utils/constants");
const { isNullOrUndefined } = require("../utils/index");
const { logger } = require("../../app/middlewares");
const userProfileRoutes = require("../routes/userProfile.routes");

const getAllUsers = async () => {
  const users = await User.find({  deleted: false });
  if (!users || users.length === 0) {
    const data = { success: false, message: "Users details not found" };
    return { data, status: 404 };
  }

  const userViewData = [];
  for (const usr of users) {
    // find role ID by role name]
    const rolesDocument = await Role.find({ _id: { $in: usr.roles } });

    if (!rolesDocument) {
      const data = { success: false, message: "Roles not found" };
      return { data, status: 400 };
    }

    const roleNames = rolesDocument.map((item) => item.name);

    if (roleNames && roleNames.length > 0) {
      usr.viewRoles = roleNames;
    } else {
      const data = { success: false, message: "Error or Roles invalid" };
      return { data, status: 500 };
    }

    const userData = new User({
      _id: usr._id,
      firstName: usr.firstName,
      lastName: usr.lastName,
      email: usr.email,
      viewRoles: roleNames,
      roles: usr.roles,
      activated: usr.activated,
    });

    userViewData.push(userData);
  }

  const data = { success: true, userViewData, count: userViewData.length };

  return { data, status: 200 };
};

const getUserByUserId = async (userId) => {
  const user = await User.findOne({ _id: userId, activated: true });
  if (!user) {
    const data = { success: false, message: "User details not found" };
    return { data, status: 404 };
  }

  // find role ID by role name
  const rolesDocument = await Role.find({ _id: { $in: user.roles } });

  if (!rolesDocument) {
    const data = { success: false, message: "Roles not found" };
    return { data, status: 400 };
  }

  const roleNames = rolesDocument.map((item) => item.name);

  if (roleNames && roleNames.length > 0) {
    user.roles = roleNames;
  } else {
    const data = { success: false, message: "Error or Roles invalid" };
    return { data, status: 500 };
  }

  const userData = new User({
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    viewRoles: roleNames,
    roles: user.roles,
    activated: user.activated,
  });

  const data = { success: true, userData };

  return { data, status: 200 };
};

const updateUserRole = async (req, res) => {
  if (isNullOrUndefined(req) || isNullOrUndefined(req.body)) {
    const data = { success: false, message: "invalid request" };
    return { data, status: 400 };
  }

  console.log("roles", req.body.roles);
  const isValidUserRoles = (req.body && req.body.roles.length > 0 );

    console.log(isValidUserRoles);
  if (!isValidUserRoles) {
    const data = { success: false, message: "invalid user roles in request" };
    return { data, status: 400 };
  }

  const user = await User.findOne({ _id: req.params.userId, activated: true });
  if (!user) {
    const data = { success: false, message: "User not found" };
    return { data, status: 404 };
  }

  // find role ID by role name
  const { roles } = req.body;
  const rolesDocument = await Role.find({ name: { $in: roles } });

  if (!rolesDocument) {
    const data = { success: false, message: "invalid roles in request" };
    return { data, status: 400 };
  }

  const roleIds = rolesDocument.map((item) => item._id);

  if (roleIds && roleIds.length > 0) {
    await User.findByIdAndUpdate(
      req.params.userId,
      { $set: { roles: roleIds }, modifiedAt: Date.now() },
      { runValidators: true, new: true }
    );
  }

  const data = {
    success: true,
    message: "User role updated successfully",
  };

  return { data, status: 200 };
};

const activateOrDeActivateUserByUserId = async (req, res) => {
  if (
    isNullOrUndefined(req) ||
    isNullOrUndefined(req.params) ||
    isNullOrUndefined(req.body) ||
    isNullOrUndefined(req.params.userId)
  ) {
    const data = { success: false, message: "invalid request" };
    return { data, status: 400 };
  }

  const user = await User.findOne({ _id: req.params.userId, deleted: false });
  if (!user) {
    const data = { success: false, message: "User not found" };
    return { data, status: 404 };
  }

  await User.findByIdAndUpdate(
    req.params.userId,
    { $set: { activated: req.body.activated }, modifiedAt: Date.now() },
    { runValidators: true, new: true }
  );

  const data = {
    success: true,
    message: "User activate status is updated successfully",
  };

  return { data, status: 200 };
};

module.exports = {
  getAllUsers,
  getUserByUserId,
  updateUserRole,
  activateOrDeActivateUserByUserId,
};
