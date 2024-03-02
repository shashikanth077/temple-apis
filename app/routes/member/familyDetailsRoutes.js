const { authJwt } = require("../../middlewares");
const controller = require("../../controllers/member/familyDetailsController");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get(
    "/api/family/:userId/:id",
    [authJwt.verifyToken],
    controller.getFamilyDetailsByUserId
  );

  app.get(
    "/api/families/:userId",
    [authJwt.verifyToken],
    controller.getFamilyListByUserId
  );

  app.post(
    "/api/family/:userId",
    [authJwt.verifyToken],
    controller.createFamilyDetailsController
  );

  app.put(
    "/api/family/:userId/:familyId",
    [authJwt.verifyToken],
    controller.updateFamilyDetailsController
  );

  app.delete(
    "/api/family/:userId/:familyId",
    [authJwt.verifyToken],
    controller.deleteFamilyDetailsController
  );
};
