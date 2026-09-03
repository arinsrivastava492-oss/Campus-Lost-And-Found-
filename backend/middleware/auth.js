// middleware/auth.js
// -----------------------------------------------------------------------
// This middleware protects certain routes so that only logged-in users
// (people with a valid JWT token) can access them — for example,
// creating a new lost/found post, or deleting one.
//
// How JWT auth works here, step by step:
// 1. On login, the server creates a signed token containing the user's ID.
// 2. The frontend stores that token (in localStorage) and sends it in the
//    "Authorization" header on every request that needs it:
//        Authorization: Bearer <token>
// 3. This middleware reads that header, verifies the token is genuine and
//    not expired, and attaches the matching user to req.user.
// 4. If the token is missing or invalid, the request is rejected with 401.
// -----------------------------------------------------------------------

const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      // "Bearer abc123token" -> "abc123token"
      token = authHeader.split(" ")[1];

      // Verify the token's signature and expiry using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the logged-in user (minus password) to the request object
      // so later route handlers can use req.user._id, req.user.name, etc.
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res.status(401).json({ message: "User no longer exists" });
      }

      next(); // token is valid — continue to the actual route handler
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
}

module.exports = { protect };
