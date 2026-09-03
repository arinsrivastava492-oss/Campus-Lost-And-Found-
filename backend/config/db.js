// config/db.js
// -----------------------------------------------------------------------
// This file's only job is to connect our app to MongoDB using Mongoose.
// Mongoose is a library that lets us work with MongoDB using JavaScript
// objects ("models") instead of writing raw database queries.
// -----------------------------------------------------------------------

const mongoose = require("mongoose");

async function connectDB() {
  try {
    // mongoose.connect() reads the connection string from our .env file
    // (see server.js, where dotenv loads it into process.env)
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    // If the database is unreachable (wrong URI, MongoDB not running, etc.)
    // we log the error and stop the app — there's no point running an API
    // that can't talk to its database.
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
}

module.exports = connectDB;
