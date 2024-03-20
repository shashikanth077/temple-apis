const { authJwt } = require("../../middlewares");
const controller = require("../../controllers/member/eventController");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

/**
 * @swagger
 * /api/events/filter:
 *   get:
 *     summary: Get Events
 *     description: Retrieve Events data
 *     security:
 *       - JWT: []
 *     responses:
 *       '200':
 *         description: A successful response
 */
  app.get("/api/events/filter", controller.getEventsByFilterController);
/**
 * @swagger
 * /api/event-booking:
 *   post:
 *     summary: Create new Event
 *     description: Create a new Event
 *     security:
 *       - JWT: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 */
  app.post(
    "/api/event-booking",
    [authJwt.verifyToken],
    controller.bookEventController
  );
};
