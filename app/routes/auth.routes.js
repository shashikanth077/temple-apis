const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/user/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  /** POST Methods */
  /**
   * @swagger
   * '/api/user/register':
   *  post:
   *     tags:
   *     - User Controller
   *     summary: Create a user
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *            type: object
   *            required:
   *              - username
   *              - email
   *              - password
   *              - countrycode
   *              - phonenumber
   *            properties:
   *              username:
   *                type: string
   *                default: johndoe
   *              phonenumber:
   *                type: string
   *                default: 8123192799
   *              countrycode:
   *                type: string
   *                default: +91
   *              email:
   *                type: string
   *                default: johndoe@mail.com
   *              password:
   *                type: string
   *                default: johnDoe20!@
   *     responses:
   *      201:
   *        description: Created
   *      409:
   *        description: Conflict
   *      404:
   *        description: Not Found
   *      500:
   *        description: Server Error
   */
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

  app.post("/api/generateotp", controller.getOTP);

  app.post("/api/verifyotp", controller.verifyOTP);

  app.post("/api/auth/resetPassword", controller.resetPasswordController);
};
