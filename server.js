// server.js
const app = require("./app");
const dbConnect = require("./config/mongo");

const port = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(port, () => {
    console.clear();
    console.log(`🚀 - Server Started!`);
    console.log(`🛠️  - Listening on port ${port}`);
    dbConnect();
  });
}
