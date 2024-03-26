const { authJwt } = require("../../middlewares");
const controller = require("../../controllers/member/volunteerController");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post("/api/volunteers", controller.createVolunteersController);

  /**
   * @swagger
   * /api/volunteers:
   *   get:
   *     summary: Get all volunteers
   *     description: Retrieve a list of all volunteers
   *     security:
   *       - basicAuth: []
   *     responses:
   *       200:
   *         description: Successful operation
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   */
  app.get(
    "/api/volunteers",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getVolunteersController
  );

  app.put(
    "/api/volunteerapprove",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.updateVolunteerStatusController
  );
};
