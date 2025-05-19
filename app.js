// app.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const routes = require("./routes/index");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", routes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.static("storage"));

module.exports = app;
