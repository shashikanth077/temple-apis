const authRoutes = require("./authRoutes");

function loadAuthRoutes(app) {
  authRoutes(app);
}

module.exports = loadAuthRoutes;
