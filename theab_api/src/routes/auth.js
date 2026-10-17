const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");
const db = require("../db");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

/**
 * Generate JWT token for user
 */
function generateToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );
}

/**
 * POST /api/auth/register
 * Register a new user account
 */
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Name, email, and password are required fields.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters long.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = db.findOne("users", (u) => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: "An account with this email address already exists. Please log in instead.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const initials = name
      .trim()
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    const newUser = db.insert("users", {
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      avatar: initials || "U",
      role: role || "Couple / Organizer",
    });

    const token = generateToken(newUser);
    const { password: _, ...safeUser } = newUser;

    return res.status(201).json({
      success: true,
      message: "Account registered successfully.",
      token,
      user: safeUser,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/login
 * Log in with email and password
 */
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide both email and password.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = db.findOne("users", (u) => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password. Please verify your credentials.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password. Please verify your credentials.",
      });
    }

    const token = generateToken(user);
    const { password: _, ...safeUser } = user;

    return res.json({
      success: true,
      message: "Login successful.",
      token,
      user: safeUser,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/auth/me
 * Get current authenticated user details
 */
router.get("/me", authenticateToken, (req, res) => {
  return res.json({
    success: true,
    user: req.user,
  });
});

/**
 * PUT /api/auth/profile
 * Update user profile details
 */
router.put("/profile", authenticateToken, (req, res, next) => {
  try {
    const { name, role, avatar } = req.body;
    const updates = {};

    if (name) updates.name = name.trim();
    if (role) updates.role = role.trim();
    if (avatar) updates.avatar = avatar;

    const updated = db.updateById("users", req.user.id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, error: "User not found." });
    }

    const { password: _, ...safeUser } = updated;
    return res.json({
      success: true,
      message: "Profile updated successfully.",
      user: safeUser,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
