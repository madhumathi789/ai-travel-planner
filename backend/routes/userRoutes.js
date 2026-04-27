

const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();
const isPasswordValid = (password) => {
   if (!password) return false;
  return (
    password.length >= 4 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[@$!%*?&]/.test(password)
  );
};

console.log("🔥 user.js route file LOADED");
// MUST protect routes
router.use(auth);

// GET profile
router.get("/profile", async (req, res) => {
  console.log("📌 /api/user/profile HIT");

  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE profile
router.put("/profile", async (req, res) => {
  try {
    const { username, email, password, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    // If user wants to change password
    if (password && newPassword) {
  const match = await user.comparePassword(password);
  if (!match) {
    return res.status(400).json({ message: "Incorrect current password" });
  }

  if (!isPasswordValid(newPassword)) {
    return res.status(400).json({
      message:
        "New password must be at least 4 characters and include uppercase, lowercase, number, and special character",
    });
  }

  user.password = newPassword;
}

    if (username) user.name = username;
    if (email) user.email = email;

    await user.save();

    res.json({
    message: "Profile updated successfully",
    user: {
      username: user.username,
      email: user.email,
    },
  });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
