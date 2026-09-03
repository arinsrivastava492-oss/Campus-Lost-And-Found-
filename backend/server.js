// server.js
// -----------------------------------------------------------------------
// This is the entry point of the backend. Running "node server.js"
// (or "npm start") starts the whole API.
//
// What happens here, in order:
//   1. Load environment variables from .env
//   2. Connect to MongoDB
//   3. Set up Express + middleware (CORS, JSON parsing)
//   4. Mount our route files under /api/auth and /api/items
//   5. Start listening for requests
// -----------------------------------------------------------------------

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");

// Connect to the database before the server starts handling requests
connectDB();

const app = express();

// --- Middleware -----------------------------------------------------
app.use(cors()); // allows the React frontend (different port) to call this API
app.use(express.json()); // lets us read JSON data sent in request bodies

// --- Routes ------------------------------------------------------------
app.get("/", (req, res) => {
  res.send("Campus Lost & Found API is running 🎒");
});

app.use("/api/auth", authRoutes); // /api/auth/register, /api/auth/login, /api/auth/me
app.use("/api/items", itemRoutes); // /api/items, /api/items/:id, /api/items/mine

// --- 404 handler for unknown routes ------------------------------------
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// --- Global error handler ------------------------------------------
// Any error passed to next(err) anywhere in the app ends up here.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
