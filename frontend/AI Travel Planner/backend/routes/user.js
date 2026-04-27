// const express = require("express");
// const User = require("../models/User");
// const auth = require("../middleware/auth");

// const router = express.Router();

// // MUST protect routes
// router.use(auth);

// // GET profile
// router.get("/profile", async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select("-password");
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // UPDATE profile
// router.put("/profile", async (req, res) => {
//   try {
//     const { name, email, password, newPassword } = req.body;

//     const user = await User.findById(req.user._id);

//     // If user wants to change password
//     if (password && newPassword) {
//       const match = await user.comparePassword(password);
//       if (!match) {
//         return res.status(400).json({ message: "Incorrect current password" });
//       }
//       user.password = newPassword;
//     }

//     if (name) user.name = name;
//     if (email) user.email = email;

//     await user.save();

//     res.json({
//       message: "Profile updated successfully",
//       user: { name: user.name, email: user.email },
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;

const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// Protect routes
router.use(auth);

// GET profile
router.get("/profile", async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({
      username: user.username,
      email: user.email
    });
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
      // If no comparePassword exists — skip
      if (typeof user.comparePassword === "function") {
        const match = await user.comparePassword(password);
        if (!match) {
          return res.status(400).json({ message: "Incorrect current password" });
        }
      }
      user.password = newPassword;
    }

    // Update username & email
    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
