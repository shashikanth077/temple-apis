const contentRoutes = require("./contentRoutes");
const donationsRoutes = require("./donationsRoutes");
const eventsRoutes = require("./eventRoutes");
const godRoutes = require("./godRoutes");
const productsRoutes = require("./productsRoutes");
const serviceRoutes = require("./serviceRoutes");
const sevaRoutes = require("./sevaRoutes");
const userRoutes = require("./userRoutes");
const roleRoutes = require("./roleRoutes");

function loadAdminRoutes(app) {
  contentRoutes(app);
  donationsRoutes(app);
  eventsRoutes(app);
  godRoutes(app);
  productsRoutes(app);
  serviceRoutes(app);
  sevaRoutes(app);
  userRoutes(app);
  roleRoutes(app);
}

module.exports = loadAdminRoutes;
