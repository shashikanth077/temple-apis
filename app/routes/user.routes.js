const { authJwt } = require("../middlewares");
const controller = require("../controllers/user/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  app.get(
    "/api/users",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getAllUsers
  );

  app.get(
    "/api/:userId/user",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getUserByUserId
  );

  app.post(
    "/api/user",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.addUserByAdmin
  );

  app.put(
    "/api/:userId/roles",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.updateUserRole
  );

  app.put(
    "/api/:userId/activate",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.activateOrDeActivateUserByUserId
  );
};
