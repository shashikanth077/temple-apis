const { authJwt } = require("../middlewares");
const controller = require("../controllers/service.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/api/services", controller.getAllServicesController);

  app.get(
    "/api/service/:godId",
    [authJwt.verifyToken],
    controller.getServicesByGodIdController
  );

  app.get(
    "/api/services/:_id",
    [authJwt.verifyToken],
    controller.getServiceByServiceIdController
  );

  app.post(
    "/api/service/:godId",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.addServiceDetailsController
  );

  app.put(
    "/api/service/:godId/:serviceId",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.updateServiceDetailsController
  );

  app.put(
    "/api/service/:serviceId",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.inActivateServiceByServiceIdController
  );

  app.put(
    "/api/service/:godId",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.inActivateServiceByGodIdController
  );
};
