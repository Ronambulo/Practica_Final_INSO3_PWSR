const dbConnect = require("./config/mongo");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Create express instance and configure it
const app = express();
app.use(cors());
app.use(express.json());

//TODO: Define the routes

// Define the port
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.clear();
  console.log(`🚀 - Server Started!`);
  console.log(`🛠️  - Listening on port ${port}`);
  dbConnect();
});
