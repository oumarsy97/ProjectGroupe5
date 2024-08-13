
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestion Couture pour Tailleurs et Clients',
      version: '1.0.0',
      description: 'Une API pour gérer la communication entre les tailleurs et les clients',
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1', // URL de ton API (ajuste selon ta configuration)
      },
    ],
  },
  apis: ['../Route/*.js'], // Chemin vers tes fichiers de routes contenant les annotations Swagger
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };