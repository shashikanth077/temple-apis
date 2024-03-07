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

    // Check if connected to the database
    const dbConnection = mongoose.connection;
    dbConnection.on("connected", () => {
      logger.info("Connected to the database");
    });

    dbConnection.on("error", (err) => {
      logger.error("Error connecting to the database", err);
    });

    logger.info("Database connection established");
  } catch (error) {
    logger.error("Failed to connect to the database", error);
    process.exit(1);
  }
}

module.exports = connectToMongoDB;
