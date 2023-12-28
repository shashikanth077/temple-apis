const fs = require("fs");
var path = require("path");
const bodyParser = require("body-parser");
const { logger } = require("../middlewares/logger");
const AppConfig = require("../config/app.config.js");

exports.contentController = async (req, res) => {
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
      res.status(400).json({
        success: false,
        message: "Invalid JSON format",
        details: error.message,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error (Content)" });
  }
};
