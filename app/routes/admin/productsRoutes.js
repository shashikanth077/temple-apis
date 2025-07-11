const { authJwt } = require("../../middlewares");
const controller = require("../../controllers/admin/productController");

const { upload } = require("../../utils/fileUpload");
const productFolder = upload("uploads/products"); //products folder path

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/api/products", controller.getAllProductsController);
  app.get("/api/product/:id", controller.getProductByIdController);

  app.post(
    "/api/product",
    [authJwt.verifyToken, authJwt.isAdmin],
    productFolder.single("productimage"),
    controller.createProductController
  );

  app.put(
    "/api/product/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    productFolder.single("productimage"),
    controller.updateProductController
  );

  app.post(
    "/api/product/delete/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteProductController
  );
};
