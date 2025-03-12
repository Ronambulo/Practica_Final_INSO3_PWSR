const mongoose = require("mongoose");

const dbConnect = () => {
  const db_uri = process.env.DB_URI;
  mongoose.set("strictQuery", false);

  mongoose.connect(db_uri);

  mongoose.connection.once("connected", () => {
    console.log("✅ - Connected to the database");
  });
  mongoose.connection.on("error", (err) => {
    console.error("❌ - Error connecting to the database: ", err);
  });
};

module.exports = dbConnect;
