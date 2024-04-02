const { authJwt } = require("../../middlewares");
const controller = require("../../controllers/admin/roleController");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/api/roles", controller.getAllRolesController);
  app.get("/api/role/:id", controller.getRoleByIdController);

  app.post(
    "/api/roles",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.addRolesController
  );

  app.put(
    "/api/roles/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.updateRoleController
  );

  app.delete(
    "/api/roles/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteRoleController
  );
};
