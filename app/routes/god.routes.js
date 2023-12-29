const { authJwt } = require("../middlewares");
const controller = require("../controllers/god.controller");

const { upload } = require('../utils/fileUpload');
const godFolder = upload('uploads/gods'); //services folder path

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/api/gods", controller.getAllGodsListController);

  app.get("/api/god/:id", controller.getGodDetailsByIdController);

  app.post(
    "/api/god",
    [authJwt.verifyToken, authJwt.isAdmin],
    godFolder.single('image'),
    controller.addGodDetailsController
  );

  app.put(
    "/api/god/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    godFolder.single('image'),
    controller.updateGodDetailsController
  );

  app.post(
    "/api/god/delete/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteGodDetailsController
  );
};
