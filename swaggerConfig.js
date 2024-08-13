  // swaggerConfig.js
  import swaggerJsdoc from 'swagger-jsdoc';
  import swaggerUi from 'swagger-ui-express';
  import { User, Tailor } from './Model/User.js'; // Importe tes modèles Mongoose
  import mongooseToSwagger from 'mongoose-to-swagger';
  // Convertir les modèles Mongoose en schémas Swagger
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
      },
      servers: [
        {
          url: 'http://localhost:5000/api/v1', // URL de ton API (ajuste selon ta configuration)
        },
      ],
    },
    apis: ['./Route/*.js'], // Chemin vers tes fichiers de routes contenant les annotations Swagger
  };

  const swaggerSpec = swaggerJsdoc(options);

  export { swaggerUi, swaggerSpec };

