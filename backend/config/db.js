
const mongoose = require('mongoose');
const password = encodeURIComponent("todayiwenttoRampally@8374");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`mongodb+srv://admin:${password}@eeasyhr.uybpd.mongodb.net/easyhr`);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
