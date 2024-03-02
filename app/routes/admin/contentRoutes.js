const controller = require("../../controllers/admin/contentController");
const { authJwt } = require("../../middlewares");
const { upload } = require("../../utils/fileUpload");
const staticFolder = upload("uploads/staticfile");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/api/content", controller.getStaticContentJson);

  app.post(
    "/api/staticupload",
    [authJwt.verifyToken, authJwt.isAdmin],
    staticFolder.single("staticFile"),
    controller.uploadStaticFile
  );
};
