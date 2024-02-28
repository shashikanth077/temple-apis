const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Your API Title',
        version: '1.0.0',
        description: 'Your API Description',
      },
    },
    components: {
      schemas: {
        UserSignup: {
          type: 'object',
          properties: {
            // Define properties based on your user model
            username: { type: 'string' },
            email: { type: 'string' },
            // Add other properties...
          },
          required: ['username', 'email'], // Specify required properties
        },
      },
    },
    // API specifications
    apis: ['./app/routes/*.js'], // Path to your route files
  };

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
