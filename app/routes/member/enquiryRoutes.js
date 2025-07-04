const controller = require("../../controllers/member/enquiryController");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post("/api/sendEnquiry", controller.sendEnquiryController);
};
