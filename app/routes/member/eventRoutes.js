const { authJwt } = require("../../middlewares");
const controller = require("../../controllers/member/eventController");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/api/events/filter/:type", controller.getEventsByFilterController);

  app.post(
    "/api/event-booking",
    [authJwt.verifyToken],
    controller.bookEventController
  );
};
