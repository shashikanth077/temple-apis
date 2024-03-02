const { authJwt } = require("../../middlewares");
const controller = require("../../controllers/admin/eventController");

const { upload } = require("../../utils/fileUpload");
const imageFolder = upload("uploads/events"); //products folder path

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/api/events", controller.getAllEventsController);
  app.get("/api/event/:id", controller.getEventByIdController);

  app.post(
    "/api/events",
    [authJwt.verifyToken, authJwt.isAdmin],
    imageFolder.single("image"),
    controller.addEventsController
  );

  app.post("/api/events/filter", controller.getEventsByFilterController);

  app.put(
    "/api/event/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    imageFolder.single("image"),
    controller.updateEventController
  );

  app.post(
    "/api/event/delete/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteEventController
  );

  app.post(
    "/api/event-booking",
    [authJwt.verifyToken],
    controller.bookEventController
  );
};
