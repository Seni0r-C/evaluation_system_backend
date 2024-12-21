const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Configuración de Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentación',
            version: '1.0.0',
            description: 'Documentación de la API para el proyecto',
        },
        servers: [
            {
                url: 'http://localhost:3000', // Cambia la URL si usas un entorno diferente
            },
        ],
    },
    apis: ['./src/routes/*.js'], // Ruta a tus archivos de rutas
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const setupSwaggerDocs = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log('Documentación disponible en /api-docs');
};

module.exports = setupSwaggerDocs;