const { authJwt } = require("../middlewares");
const webhook = require("../controllers/payment/webhook.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get(
    "/api/webhook", 
    [authJwt.verifyToken, authJwt.isAdmin],
    webhook.handleWebhook
  );

};
