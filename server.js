const dbConnect = require("./config/mongo");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const routes = require("./routes/index");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const handleError = require("./middleware/handleError");

// Create express instance and configure it
const app = express();
app.use(cors());
app.use(express.json());

// Define the routes
app.use("/", routes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.static("storage"));
app.use(handleError);

// Define the port
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.clear();
  console.log(`🚀 - Server Started!`);
  console.log(`🛠️  - Listening on port ${port}`);
  dbConnect();
});
