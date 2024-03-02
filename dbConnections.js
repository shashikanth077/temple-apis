// dbConnection.js
const mongoose = require("mongoose");
const { logger } = require("./app/middlewares");
const dbConfig = require("./app/config/dbConfig");

async function connectToMongoDB() {
  try {
    await mongoose.connect(
      `mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    // You can call other initialization functions here if needed
  } catch (error) {
    logger.error("Failed to connect to the database", error);
    process.exit(1);
  }
}

module.exports = connectToMongoDB;
