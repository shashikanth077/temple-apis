const controller = require("../../controllers/admin/contentController");
const { authJwt } = require("../../middlewares");
const { upload } = require("../../utils/fileUpload");
const staticFolder = upload("uploads/staticfile");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  /**
   * @swagger
   * /api/content:
   *   get:
   *     tags: [Content Controller]
   *     summary: Get static content JSON
   *     security:
   *       - basicAuth: []
   *     responses:
   *       200:
   *         description: OK
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Not Found
   *       500:
   *         description: Server Error
   */
  app.get("/api/content", controller.getStaticContentJson);

  /**
   * @swagger
   * /api/staticupload:
   *   post:
   *     tags: [Content Controller]
   *     summary: Upload static file
   *     security:
   *       - basicAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               staticFile:
   *                 type: string
   *                 format: binary
   *     responses:
   *       200:
   *         description: OK
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Not Found
   *       500:
   *         description: Server Error
   */
  app.post(
    "/api/staticupload",
    [authJwt.verifyToken, authJwt.isAdmin],
    staticFolder.single("staticFile"),
    controller.uploadStaticFile
  );
};
