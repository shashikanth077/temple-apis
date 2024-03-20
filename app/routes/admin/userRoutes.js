const { authJwt } = require("../../middlewares");
const controller = require("../../controllers/admin/userController");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });
/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: User login
 *     description: Authenticate user and generate JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: A successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 */
app.post("/api/auth/signin", (req, res) => {
  const { username, password } = req.body;
  // Validate username and password
  if (username === "ClientApi" && password === "ClientApi") {
    // Generate JWT token
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get Users
 *     description: Retrieve Users List
 *     security:
 *       - JWT: []
 *     responses:
 *       '200':
 *         description: A successful response
 */
  app.get(
    "/api/users",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getAllUsers
  );

  app.get(
    "/api/:userId/user",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getUserByUserId
  );

  app.post(
    "/api/user",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.addUserByAdmin
  );

  app.put(
    "/api/:userId/roles",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.updateUserRole
  );

  app.put(
    "/api/:userId/activate",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.activateOrDeActivateUserByUserId
  );
};
