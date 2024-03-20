require("express-async-errors");
require("dotenv").config();
const express = require("express");
var bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");

const cookieSession = require("cookie-session");
const { logger } = require("./app/middlewares");

const loadAdminRoutes = require("./app/routes/admin");
const loadMemberRoutes = require("./app/routes/member");
const loadAuthRoutes = require("./app/routes/auth");

const swagger = require("./swagger");
const connectToMongoDB = require("./app/middlewares/dbConnect");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//white listed only respective origin
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api-docs", swagger.serve, swagger.setup);

app.use(authenticate);

app.use(
  cookieSession({
    name: "client-session",
    keys: ["COOKIE_SECRET"],
    httpOnly: true,
  })
);

app.use(
  express.json({
    verify: (req, res, buffer) => (req["rawBody"] = buffer),
  })
);

app.use(mongoSanitize());
app.use(compression());

connectToMongoDB();
loadAdminRoutes(app);
loadAuthRoutes(app);
loadMemberRoutes(app);

//when not found any URL
app.all("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    success: false,
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

// set port, listen for requests
const PORT = process.env.SERVERPORT || 8080;
app.listen(PORT, () => {
  logger.info(`Running Node.js version ${process.version}`);
});
