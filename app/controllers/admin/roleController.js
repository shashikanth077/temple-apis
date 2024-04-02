const { logger } = require("../../middlewares");

const {
    getAllRoles,
    getRoleById,
    addRoles,
    updateRole,
    deleteRole,
} = require("../../services/admin/roleService");

exports.getAllRolesController = async (req, res, next) => {
    try {
        const getAllRoleService = await getAllRoles();
        return res.status(200).json(getAllRoleService);
    } catch (error) {
        logger.error("getAllRoleService Error:", error);
        res
            .status(500)
            .json({ error: "Internal server error (getAllRoleService)" });
    }
};

exports.getRoleByIdController = async (req, res, next) => {
    try {
        const role = await getRoleById(req);
        return res.status(200).json(role);
    } catch (error) {
        logger.error("getRoleById Error:", error);
        res.status(500).json({ error: "Internal server error (getRoleById)" });
    }
};

exports.addRolesController = async (req, res, next) => {
    try {
        const roles = await addRoles(req);
        return res.status(200).json(roles);
    } catch (error) {
        logger.error("addRolesController Error:", error);
        res.status(500).json({ error: "Internal server error (addRoles)" });
    }
};

exports.updateRoleController = async (req, res) => {
    try {
        const role = await updateRole(req);
        return res.status(200).json(role);
    } catch (error) {
        logger.error("updateRole Error:", error);
        res
            .status(500)
            .json({ error: "Something went wrong please try again (updateRole)" });
    }
};

exports.deleteRoleController = async (req, res) => {
    try {
        const role = await deleteRole(req);
        return res.status(200).json(role);
    } catch (error) {
        logger.error("deleteRole Error:", error);
        res
            .status(500)
            .json({ error: "Something went wrong please try again (deleteRole)" });
    }
};

