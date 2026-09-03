// models/User.js
// -----------------------------------------------------------------------
// Defines what a "User" looks like in the database, and adds a couple of
// helper methods for handling passwords securely.
// -----------------------------------------------------------------------

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // no two users can share an email
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // never return the password field by default in queries
    },
    campusId: {
      type: String, // e.g. college roll number / student ID (optional)
      trim: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// -----------------------------------------------------------------------
// Mongoose "pre-save" hook: this function runs automatically right before
// a user document is saved to the database. We use it to hash (scramble)
// the password so we NEVER store plain-text passwords.
// -----------------------------------------------------------------------
userSchema.pre("save", async function (next) {
  // Only hash the password if it's new or has been changed
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// -----------------------------------------------------------------------
// Instance method: lets us do  user.comparePassword("typedPassword")
// to check a login attempt against the hashed password in the database.
// -----------------------------------------------------------------------
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
