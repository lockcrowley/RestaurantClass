const { connect } = require('mongoose');
const MONGO_URL = process.env.MONGO_URL;

exports.connectDatabaseMongo = async () => {
  try {
    await connect(MONGO_URL);
    console.log('Connect with mongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}