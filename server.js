require("express-async-errors");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const { logger } = require("./app/middlewares");

const dbConfig = require("./app/config/db.config");

const app = express();

//white listed only respective origin
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//Basic Auth
app.use(authenticate);

app.use(
  cookieSession({
    name: "client-session",
    keys: ["COOKIE_SECRET"], // should use as secret environment variable
    httpOnly: true,
  })
);

const db = require("./app/models");
const Role = db.role;

// TODO::move to db.js
db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    logger.error("Failed to connect to database", err);
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to client application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

//enquiry
require("./app/routes/enquiry.routes")(app);

//products
require("./app/routes/products.routes")(app);

//carts
require("./app/routes/cart.routes")(app);

//events
require("./app/routes/event.routes")(app);

// user profile
require("./app/routes/userProfile.routes")(app);

// family details
require("./app/routes/familyDetails.routes")(app);

// god details
require("./app/routes/god.routes")(app);

// service details
require("./app/routes/service.routes")(app);

// content
require("./app/routes/content.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  logger.info(`Running Node.js version ${process.version}`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
