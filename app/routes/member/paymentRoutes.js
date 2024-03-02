const { authJwt } = require("../../middlewares");
const PaymentController = require("../../controllers/member/paymentController");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post(
    "/api/create-checkout-session",
    [authJwt.verifyToken],
    PaymentController.createCheckoutSession
  );

  app.post(
    "/api/create-payment-intent",
    [authJwt.verifyToken],
    PaymentController.paymentIntent
  );

  app.post(
    "/api/save-payment-method",
    [authJwt.verifyToken],
    PaymentController.PaymentSetupIntent
  );

  app.get(
    "/api/get-payment-methods",
    [authJwt.verifyToken],
    PaymentController.getCards
  );

  app.put(
    "/api/update-payment-intent",
    [authJwt.verifyToken],
    PaymentController.PaymentUpdateIntent
  );
};
