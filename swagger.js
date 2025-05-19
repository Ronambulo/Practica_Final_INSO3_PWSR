const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API de Digitalización de Albaranes",
    version: "1.0.0",
    description:
      "Documentación de la API Express para gestión de usuarios, clientes, proyectos y albaranes",
  },
  servers: [{ url: "http://localhost:5000", description: "Servidor local" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"], // Aquí se buscarán los comentarios JSDoc para generar docs
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
