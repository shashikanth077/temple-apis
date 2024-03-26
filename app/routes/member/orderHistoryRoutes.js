const { authJwt } = require("../../middlewares");
const controller = require("../../controllers/member/orderHistoryController");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  /**
   * @swagger
   * /api/orders/{id}/{type}:
   *   get:
   *     tags: [Order Controller]
   *     summary: Get orders by user ID and type
   *     security:
   *       - basicAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: User ID
   *       - in: path
   *         name: type
   *         required: true
   *         schema:
   *           type: string
   *         description: Type of orders
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
  app.get(
    "/api/getTranscation",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getTranscationDetails
  );
};
