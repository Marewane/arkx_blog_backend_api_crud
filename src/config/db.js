const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blog_db');
    console.log('Connected to MongoDB via Mongoose');
  } catch (err) {
    console.error('DB connection error:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;