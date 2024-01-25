const { authJwt } = require("../middlewares");
const controller = require("../controllers/booking.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post(
    "/api/booking",
    [authJwt.verifyToken],
    controller.createBookingsController
  );

  app.get("/api/bookings", controller.getSevaList);
};
