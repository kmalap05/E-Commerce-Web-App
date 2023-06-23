const mongoose = require("mongoose");

const dbConnect = async () => {
  const MONGODB_URL = process.env.MONGODB_URL;

  const dbConn = await mongoose.connect(MONGODB_URL);

  console.log(`MongoDB Connected: ${dbConn.connection.host}`);
};

module.exports = dbConnect;
