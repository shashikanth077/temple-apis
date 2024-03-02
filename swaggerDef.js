const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "NorthGaze Apis",
      version: "1.0.0",
      description: "NorthGaze Apis",
    },
  },
  // API specifications
  apis: ["./app/routes/*.js"], // Path to your route files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
