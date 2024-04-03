const { verifySignUp } = require("../../middlewares");
const controller = require("../../controllers/auth/authController");

/**
 * Registers the authentication routes.
 *
 * @param {Object} app - The Express app object.
 */
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  /**
   * @swagger
   * tags:
   *   name: User Controller
   *   description: API endpoints for user authentication
   */

  
  /**
   * @swagger
   * /api/auth/signup:
   *   post:
   *     tags: [Auth Controller]
   *     summary: Sign up for a new account
   *     security:
   *       - basicAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - firstName
   *               - lastName
   *               - email
   *               - TermConcent
   *               - password
   *               - countrycode
   *               - phonenumber
   *             properties:
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
   *               email:
   *                 type: string
   *               TermConcent:
   *                 type: boolean
   *               password:
   *                 type: string
   *               countrycode:
   *                 type: string
   *               phonenumber:
   *                 type: string
   *     responses:
   *       200:
   *         description: OK
   *       400:
   *         description: Bad Request
   *       500:
   *         description: Server Error
   */
  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.signup
  );

  /**
   * @swagger
   * /api/auth/signin:
   *   post:
   *     tags: [Auth Controller]
   *     summary: Sign in to the application
   *     security:
   *       - basicAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 default: johndoe@mail.com
   *               password:
   *                 type: string
   *                 default: johnDoe20!@
   *     responses:
   *       200:
   *         description: OK
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Not Found
   *       500:
   *         description: Server Error
   */
  app.post("/api/auth/signin", controller.signin);

  app.post("/api/auth/signout", controller.signout);

  app.post(
    "/api/auth/requestResetPassword",
    controller.resetPasswordRequestController
  );

  app.post("/api/generateotp", controller.getOTP);

  app.post("/api/verifyotp", controller.verifyOTP);

  app.post("/api/auth/resetPassword", controller.resetPasswordController);

  app.get("/api/activate/:token", controller.activateEmail);
};
