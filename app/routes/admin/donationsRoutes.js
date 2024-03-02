const { authJwt } = require("../../middlewares");
const controller = require("../../controllers/admin/donationController");
const { upload } = require("../../utils/fileUpload");
const donationFolder = upload("uploads/donations"); //donations folder path

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post(
    "/api/donation-type",
    [authJwt.verifyToken, authJwt.isAdmin],
    donationFolder.single("image"),
    controller.addDonationTypeController
  );

  app.put(
    "/api/donation-type/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    donationFolder.single("image"),
    controller.updateDonationTypeDetailsController
  );

  app.post(
    "/api/donation-type/details",
    // [authJwt.verifyToken, authJwt.isAdmin],
    controller.getDonationTypesByFrequencyController
  );

  app.delete(
    "/api/donation-type/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteDonationTypeDetailsController
  );

  app.get(
    "/api/donation-type/:id",
    // [authJwt.verifyToken, authJwt.isAdmin],
    controller.getDonationTypeDetailsByIdController
  );

  app.get(
    "/api/donations-type/:type",
    // [authJwt.verifyToken, authJwt.isAdmin],
    controller.getDonationTypeDetailsByTypeController
  );
};
