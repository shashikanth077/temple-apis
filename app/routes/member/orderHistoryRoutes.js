const { authJwt } = require("../../middlewares");
const controller = require("../../controllers/member/orderHistoryController");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.get("/api/orders/:id/:type", controller.getOrdersByUserIdType);


  /**
   * @swagger
   * /api/getTranscation:
   *   get:
   *     summary: Get transaction details
   *     description: Retrieve transaction details
   *     tags:
   *       - Transaction
   *     security:
   *       - basicAuth: []
   *         description: Transaction type
   *     responses:
   *       200:
   *         description: Successful operation
   *       401:
   *         description: Unauthorized
   *       404:
   *         description: Not found
   */
  app.get("/api/getTranscation", [authJwt.verifyToken, authJwt.isAdmin], controller.getTranscationDetails);
};
