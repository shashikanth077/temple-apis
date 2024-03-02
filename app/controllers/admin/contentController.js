const fs = require("fs");
var path = require("path");
const { logger } = require("../../middlewares");
const AppConfig = require("../../config/appConfig.js");

exports.getStaticContentJson = async (req, res) => {
  try {
    const contentPath = path.join(
      __dirname,
      AppConfig.contentPath + AppConfig.fileName
    );
    const content = fs.readFileSync(contentPath, "utf-8");
    let jsonData;
    try {
      jsonData = JSON.parse(content);
      res
        .status(200)
        .json({ success: true, message: "Valid JSON Content", data: jsonData });
    } catch (error) {
      logger.error("getStaticContentJson Error:", error);
      res.status(400).json({
        success: false,
        message: "Invalid JSON format",
        details: error.message,
      });
    }
  } catch (error) {
    logger.error("getStaticContentJson Error:", error);
    res.status(500).json({ error: "Internal server error (Content)" });
  }
};

exports.uploadStaticFile = async (req, res) => {
  try {
    const data = { success: true, message: "Static file uploded succesfully!" };
    return res.status(200).json(data);
  } catch (error) {
    logger.error("uploadStaticFile Error:", error);
    res.status(500).json({
      success: false,
      error: "Something went wrong please try again (uploadStaticFile)",
    });
  }
};
