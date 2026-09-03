// routes/authRoutes.js
// -----------------------------------------------------------------------
// Maps URLs (e.g. POST /api/auth/register) to the controller functions
// that handle them. Routes files stay thin on purpose — all the real
// logic lives in controllers/.
// -----------------------------------------------------------------------

const express = require("express");
const router = express.Router();

const { registerUser, loginUser, getCurrentUser } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getCurrentUser); // "protect" runs first to check the token

module.exports = router;
