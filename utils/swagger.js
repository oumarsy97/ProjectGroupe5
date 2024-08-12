const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Documentation de l\'API',
      contact: {
        name: 'Votre Nom',
        url: 'http://votre-site.com',
        email: 'votre-email@domaine.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000', // L'URL de votre serveur de développement
        description: 'Serveur de développement'
      }
    ]
  },
  apis: ['../app.js', '../Route/*.js'], // Chemin vers les fichiers où les routes sont définies
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
