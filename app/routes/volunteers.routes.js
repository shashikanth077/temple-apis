const { authJwt } = require("../middlewares");
const controller = require("../controllers/volunteer.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post(
    "/api/volunteers",
    controller.createVolunteersController
  );

  app.get(
    "/api/volunteers", 
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getVolunteersController
  );

  app.put(
    "/api/volunteerapprove", 
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.updateVolunteerStatusController
  );

};
