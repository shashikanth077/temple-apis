const { authJwt } = require("../middlewares");
const controller = require("../controllers/orderHistory.controller");


module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/api/orders/:id/:type", controller.getOrdersByUserIdType);
  app.get("/api/getTranscation", controller.getTranscationDetails);
};
