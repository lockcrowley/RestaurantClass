require('dotenv').config();

const mongo = require('./database/connection.database');
const app = require('./app');

const port = process.env.PORT || 3000;

(async () => {
  try {
    await mongo.connectDatabaseMongo();

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Server not started due to Mongo error');
    process.exit(1);
  }
})();