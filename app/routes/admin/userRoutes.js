const { authJwt } = require("../../middlewares");
const controller = require("../../controllers/admin/userController");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get Users
 *     description: Retrieve Users List
 *     security:
 *       - JWT: []
 *     responses:
 *       '200':
 *         description: A successful response
 */
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
