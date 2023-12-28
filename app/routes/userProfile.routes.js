const { authJwt } = require("../middlewares");
const controller = require("../controllers/userProfile.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get(
    "/api/profile/:userId",
    [authJwt.verifyToken],
    controller.getUserProfileByUserId
  );

  app.post(
    "/api/profile/:userId",
    [authJwt.verifyToken],
    controller.createUserProfileController
  );

  app.put(
    "/api/profile/:userId",
    [authJwt.verifyToken],
    controller.updateUserProfileController
  );

  app.delete(
    "/api/profile/:userId",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteUserProfileController
  );
};
