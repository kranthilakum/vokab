const swaggerJsdoc = require('swagger-jsdoc');
const specs = swaggerJsdoc({
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Vokab API v1',
        version: '1.0.0',
        description: 'The API for Vokab project',
      },
    },
    apis: ['./routes/*.js']
  });

module.exports = specs
