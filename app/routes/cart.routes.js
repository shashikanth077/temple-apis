const controller = require("../controllers/shop/cart.controller");
const { authJwt } = require("../middlewares");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/api/cart/:id", authJwt.verifyToken, controller.getCart);

  app.post("/api/cart", authJwt.verifyToken, controller.addCart);

  app.post(
    "/api/checkout/addhistory",
    authJwt.verifyToken,
    controller.AddBookingHistory
  );

  app.get(
    "/api/cart/delete/:productId/:userid/:type",
    authJwt.verifyToken,
    controller.deleteCart
  );
};
