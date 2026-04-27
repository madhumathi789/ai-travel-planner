// const express = require("express");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const router = express.Router();

// // // =========================
// // // ✅ REGISTER
// // // =========================
// // router.post("/register", async (req, res) => {
// //   try {
// //     console.log("Incoming registration data:", req.body);

// //     const { username, name, email, password } = req.body;
// //     const finalUsername = username || name;

// //     if (!finalUsername || !email || !password) {
// //       return res.status(400).json({ message: "All fields are required" });
// //     }

// //     // Check if user already exists
// //     const existingUser = await User.findOne({ email });
// //     if (existingUser) {
// //       return res.status(400).json({ message: "User already exists" });
// //     }

// //     // ✅ Hash the password before saving
// //     const hashedPassword = await bcrypt.hash(password, 10);

// //     const newUser = new User({
// //       username: finalUsername,
// //       email,
// //       password: hashedPassword,
// //     });

// //     await newUser.save();

// //     console.log("✅ User registered:", newUser.email);

// //     res.status(201).json({
// //       message: "User registered successfully",
// //       user: {
// //         id: newUser._id,
// //         username: newUser.username,
// //         email: newUser.email,
// //       },
// //     });
// //   } catch (error) {
// //     console.error("Register error:", error);
// //     res.status(500).json({ message: "Server error", error: error.message });
// //   }
// // });


// router.post("/register", async (req, res) => {
//   try {
//     console.log("Incoming registration data:", req.body);

//     const { username, name, email, password } = req.body;
//     const finalUsername = username || name;

//     if (!finalUsername || !email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // ✅ DO NOT HASH HERE
//     const newUser = new User({
//       username: finalUsername,
//       email,
//       password, // plain password
//     });

//     await newUser.save(); // 🔐 hashing happens in schema

//     console.log("✅ User registered:", newUser.email);

//     res.status(201).json({
//       message: "User registered successfully",
//       user: {
//         id: newUser._id,
//         username: newUser.username,
//         email: newUser.email,
//       },
//     });
//   } catch (error) {
//     console.error("Register error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });


// // =========================
// // ✅ LOGIN
// // =========================
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // ✅ Basic validation
//     if (!email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // ✅ Find user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log("❌ No user found with this email:", email);
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     // ✅ Compare password using bcrypt
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       console.log("❌ Incorrect password for user:", email);
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     // ✅ Create JWT
//     const token = jwt.sign(
//       { id: user._id, email: user.email },
//       process.env.JWT_SECRET || "default_secret",
//       { expiresIn: "30d" }
//     );

//     console.log("✅ Login successful for:", user.email);

//     res.json({
//       message: "Login successful",
//       token,
//       user: { id: user._id, username: user.username, email: user.email },
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// module.exports = router;


const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");

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

// =========================
// REGISTER
// =========================
router.post("/register", async (req, res) => {
  try {
    const { username, name, email, password } = req.body;
    const finalUsername = username || name;

    if (!finalUsername || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    if (!isPasswordValid(password)) {
  return res.status(400).json({
    message:
      "Password must be at least 4 characters and include uppercase, lowercase, number, and special character",
  });
}

    const newUser = new User({
      username: finalUsername,
      email,
      password, // plain
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// =========================
// LOGIN
// =========================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "30d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// =========================
// FORGOT PASSWORD
// =========================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save();

    console.log(
      "🔗 Password reset link:",
      `http://localhost:3000/reset-password/${resetToken}`
    );

    res.json({ message: "Password reset link sent" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
// =========================
// 🔐 RESET PASSWORD (DIRECT)
// =========================
router.post("/reset-password-direct", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!isPasswordValid(password)) {
  return res.status(400).json({
    message:
      "Password must be at least 4 characters and include uppercase, lowercase, number, and special character",
  });
}

    user.password = password; // plain password
    await user.save(); // hashed by pre-save hook

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Direct reset error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
