const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const express = require('express');
const app = express();

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

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

module.exports = app;