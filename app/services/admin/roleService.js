const Role = require("../../models/auth/roleModel");

const getAllRoles = async () => {
  const Roles = await Role.find({ deleted: false });
  return { success: true, Roles, count: Roles.length };
};

const getRoleById = async (req) => {
  const Role = await Role.findOne({ _id: req.params.id });
  return { success: true, Role };
};

const addRoles = async (req) => {
  const Role = req.body;

  if (Role.length < 1) {
    return { success: false, message: "No Role found" };
  }

  await new Role({
    name: Role.name,
    createdAt: Date.now(),
    modifiedAt: Date.now(),
  }).save();

  return { success: true, message: "Roles added successfully" };
};

const updateRole = async (req) => {
  const existingRole = await Role.findOne({
    _id: req.params.id,
    deleted: false,
  });

  if (!existingRole) {
    return { success: false, message: "Role doesn't exists" };
  }

  const Role = await Role.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { runValidators: true, new: true }
  );

  return { success: true, message: "Role updated successfully", Role };
};

const deleteRole = async (req) => {
  const existingRole = await Role.findOne({
    _id: req.params.id,
    deleted: false,
  });

  if (!existingRole) {
    return { success: false, message: "Role doesn't exists" };
  }

  const Role = await Role.findByIdAndUpdate(req.params.id, {
    $set: { deleted: true },
    modifiedAt: Date.now(),
  });

  return { success: true, message: "Role deleted successfully", Role };
};

module.exports = {
  getAllRoles,
  getRoleById,
  addRoles,
  updateRole,
  deleteRole,
};
