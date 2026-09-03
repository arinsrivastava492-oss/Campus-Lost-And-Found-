// controllers/authController.js
// -----------------------------------------------------------------------
// Contains the actual logic for registering and logging in users.
// Routes (in routes/authRoutes.js) just point to these functions.
// -----------------------------------------------------------------------

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Small helper: creates a signed JWT containing the user's ID
function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

// -----------------------------------------------------------------------
// @route   POST /api/auth/register
// @desc    Create a new user account
// @access  Public
// -----------------------------------------------------------------------
async function registerUser(req, res) {
  try {
    const { name, email, password, campusId } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    // Create the user. The password gets hashed automatically by the
    // pre-save hook we wrote in models/User.js.
    const user = await User.create({ name, email, password, campusId });

    // Immediately log them in by returning a token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error while registering user", error: error.message });
  }
}

// -----------------------------------------------------------------------
// @route   POST /api/auth/login
// @desc    Log in an existing user
// @access  Public
// -----------------------------------------------------------------------
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // .select("+password") is needed because our schema hides the password
    // field by default (select: false in models/User.js)
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      // Same error message for both cases on purpose — this avoids telling
      // an attacker whether the email exists in our system or not.
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error while logging in", error: error.message });
  }
}

// -----------------------------------------------------------------------
// @route   GET /api/auth/me
// @desc    Get the currently logged-in user's profile
// @access  Private (needs a valid token)
// -----------------------------------------------------------------------
async function getCurrentUser(req, res) {
  // req.user was attached by the "protect" middleware after verifying the token
  res.status(200).json(req.user);
}

module.exports = { registerUser, loginUser, getCurrentUser };
