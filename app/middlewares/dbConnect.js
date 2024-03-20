// dbConnection.js
const mongoose = require("mongoose");
const { logger } = require("../middlewares");
const dbConfig = require("./../config/dbConfig");


//will un comment later
const uri = `${dbConfig.DB_PREFIX}://${dbConfig.DB_USERNAME}:${dbConfig.DB_PASSWORD}@${dbConfig.DB_HOSTS}/${dbConfig.DB_NAME}?${dbConfig.DB_OPTIONS}`;

const connectToMongoDB = () => {
  try {

     mongoose.connect(
      `${uri}`,
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
