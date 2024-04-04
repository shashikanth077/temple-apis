const { authJwt } = require("../../middlewares");
const PaymentController = require("../../controllers/member/paymentController");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post(
    "/api/create-payment-intent",
    [authJwt.verifyToken],
    PaymentController.paymentIntent
  );
};
