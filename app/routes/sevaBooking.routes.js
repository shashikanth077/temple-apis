const { authJwt } = require("../middlewares");
const controller = require("../controllers/admin/sevaBooking.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post(
    "/api/seva/booking",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.addSevaBookingDetailsController
  );

  app.put(
    "/api/seva/booking/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.updateSevaBookingDetailsController
  );

  app.post(
    "/api/seva/booking-details",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getSevaBookingDetailsController
  );


  app.delete(
    "/api/seva/booking/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteSevaBookingDetailsController
  );

  app.get(
    "/api/seva/booking/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getSevaBookingDetailsByIdController
  );
};
