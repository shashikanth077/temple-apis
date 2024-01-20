const { authJwt } = require("../middlewares");
const controller = require("../controllers/deceasedDetails.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get(
    "/api/deceased/:userId/:id",
    [authJwt.verifyToken],
    controller.getDeceasedDetailsByUserId
  );

  app.get(
    "/api/deceasedlist/:userId",
    [authJwt.verifyToken],
    controller.getDeceasedListByUserId
  );

  app.post(
    "/api/deceased/:userId",
    [authJwt.verifyToken],
    controller.createDeceasedDetailsController
  );

  app.put(
    "/api/deceased/:userId/:deceasedId",
    [authJwt.verifyToken],
    controller.updateDeceasedDetailsController
  );

  app.delete(
    "/api/deceased/:userId/:deceasedId",
    [authJwt.verifyToken],
    controller.deleteDeceasedDetailsController
  );
};
