const { authJwt } = require("../middlewares");
const controller = require("../controllers/donations/donation.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post(
    "/api/donation/:userId",
    [authJwt.verifyToken],
    controller.addDonationDetailsController
  );

  app.get(
    "/api/donation/:userId",
    [authJwt.verifyToken],
    controller.getDonationDetailsByUserId
  );

  app.get(
    "/api/donation/:userId/:donationId",
    [authJwt.verifyToken],
    controller.getDonationDetailsByDonationId
  );
};
