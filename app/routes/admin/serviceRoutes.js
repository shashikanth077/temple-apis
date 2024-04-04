const { authJwt } = require("../../middlewares");
const controller = require("../../controllers/admin/serviceController");
const { upload } = require("../../utils/fileUpload");

const serviceFolder = upload("uploads/services");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/api/services", controller.getAllServicesController);

  app.get("/api/service/:godId", controller.getServicesByGodIdController);

  app.get(
    "/api/services/:_id",
    controller.getServiceByServiceIdController
  );

  app.post(
    "/api/service/:godId",
    [authJwt.verifyToken, authJwt.isAdmin],
    serviceFolder.single("image"),
    controller.addServiceDetailsController
  );

  app.put(
    "/api/service/:godId/:serviceId",
    [authJwt.verifyToken, authJwt.isAdmin],
    serviceFolder.single("image"),
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

  app.post(
    "/api/service-booking",
    [authJwt.verifyToken],
    controller.createServiceBookController
  );
};
