const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/user/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.signup
  );

  app.get("/activate/:token", controller.activateEmail);

  app.post("/api/auth/signin", controller.signin);

  app.post("/api/auth/signout", controller.signout);

  app.post(
    "/api/auth/requestResetPassword",
    controller.resetPasswordRequestController
  );

  app.post("/api/auth/resetPassword", controller.resetPasswordController);
};
