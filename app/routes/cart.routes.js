const controller = require("../controllers/shop/cart.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/api/cart/:id", controller.getCart);

  app.post("/api/cart", controller.addCart);
  app.post("/api/checkout/addhistory", controller.AddBookingHistory);
  app.get("/api/cart/delete/:productId/:userid/:type", controller.deleteCart);
};
