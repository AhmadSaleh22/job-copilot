import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Job Copilot - Profile Manager API',
    version: '1.0.0',
    description: 'Handles user registration, login, and job preferences',
  },
  servers: [
    {
      url: 'http://localhost:4001',
      description: 'Local dev server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'], // auto-load all route-level annotations
};

export const swaggerSpec = swaggerJSDoc(options);
