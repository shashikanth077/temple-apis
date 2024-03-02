const enquiryRoutes = require("./enquiryRoutes");
const cartRoutes = require("./cartRoutes");
const donationsRoutes = require("./donationRoutes");
const sevaRoutes = require("./sevaRoutes");
const useProfileRoutes = require("./userProfileRoutes");
const familyDetailsRoutes = require("./familyDetailsRoutes");
const deceasedDetailsRoutes = require("./deceasedDetailsRoutes");
const volunteerRoutes = require("./volunteerRoutes");
const paymentRoutes = require("./paymentRoutes");
const orderHistoryRoutes = require("./orderHistoryRoutes");
const webhookRoutes = require("./webhookRoutes");

function loadMemberRoutes(app) {
  enquiryRoutes(app);
  cartRoutes(app);
  donationsRoutes(app);
  sevaRoutes(app);
  useProfileRoutes(app);
  familyDetailsRoutes(app);
  deceasedDetailsRoutes(app);
  volunteerRoutes(app);
  paymentRoutes(app);
  orderHistoryRoutes(app);
  //webhookRoutes(app);
}

module.exports = loadMemberRoutes;
