// swaggerConfig.js
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { User, Tailor } from './Model/User.js';
import mongooseToSwagger from 'mongoose-to-swagger';

const userSchemaSwagger = mongooseToSwagger(User);
const tailorSchemaSwagger = mongooseToSwagger(Tailor);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gestion Couture pour Tailleurs et Clients',
      version: '1.0.0',
      description: 'Une API pour gérer la communication entre les tailleurs et les clients',
    },
    components: {
      schemas: {
        User: userSchemaSwagger,
        Tailor: tailorSchemaSwagger,
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Serveur de développement',
      },
    ],
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Users',
        description: 'Opérations liées aux utilisateurs et tailleurs',
      },
    ],
  },
  apis: ['./Route/*.js'], // Assurez-vous que ce chemin pointe vers vos fichiers de routes
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };