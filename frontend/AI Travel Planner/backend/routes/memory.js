const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Memory = require("../models/Memory");

const router = express.Router();

// ✅ Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ✅ GET all albums
router.get("/", async (req, res) => {
  try {
    const memories = await Memory.find();
    res.json(memories);
  } catch (error) {
    console.error("Error fetching memories:", error.message);
    res.status(500).json({ message: "Failed to fetch memories" });
  }
});

// ✅ POST create new album
router.post("/", async (req, res) => {
  try {
    const { name, location, description } = req.body;
    const newMemory = new Memory({
      name,
      location,
      description,
      images: [],
    });
    const saved = await newMemory.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error creating album:", error.message);
    res.status(500).json({ message: "Failed to create album" });
  }
});

// ✅ PUT upload images to existing album
router.put("/:id/upload", upload.array("images", 10), async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) return res.status(404).json({ message: "Album not found" });

    const newImages = req.files.map((file) => `/uploads/${file.filename}`);
    memory.images.push(...newImages);
    await memory.save();

    res.status(200).json(memory);
  } catch (error) {
    console.error("Error uploading images:", error.message);
    res.status(500).json({ message: "Failed to upload images" });
  }
});

// ✅ PUT update album (used for deleting a single photo)
router.put("/:id", async (req, res) => {
  try {
    const { name, location, description, images } = req.body;
    const updated = await Memory.findByIdAndUpdate(
      req.params.id,
      { name, location, description, images },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Album not found" });
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating album:", error.message);
    res.status(500).json({ message: "Failed to update album" });
  }
});

// ✅ DELETE album (and optionally delete its images from uploads)
router.delete("/:id", async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) return res.status(404).json({ message: "Album not found" });

    // Optional: remove images from server
    memory.images.forEach((imgPath) => {
      const fullPath = path.join(__dirname, "..", imgPath);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    });

    await Memory.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Album deleted successfully" });
  } catch (error) {
    console.error("Error deleting album:", error.message);
    res.status(500).json({ message: "Failed to delete album" });
  }
});

module.exports = router;


// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
// const Memory = require("../models/Memory");
// const auth = require("../middleware/auth");

// const router = express.Router();

// // 🔐 PROTECT ALL MEMORY ROUTES
// router.use(auth);

// // =========================
// // MULTER CONFIG
// // =========================
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = "uploads/";
//     if (!fs.existsSync(uploadPath)) {
//       fs.mkdirSync(uploadPath);
//     }
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage });

// // =========================
// // GET all albums (USER-SCOPED)
// // =========================
// router.get("/", async (req, res) => {
//   try {
//     const memories = await Memory.find({ user: req.user._id });
//     res.json(memories);
//   } catch (error) {
//     console.error("Error fetching memories:", error.message);
//     res.status(500).json({ message: "Failed to fetch memories" });
//   }
// });

// // =========================
// // CREATE new album
// // =========================
// router.post("/", async (req, res) => {
//   try {
//     const { name, location, description } = req.body;

//     const newMemory = new Memory({
//       user: req.user._id, // 🔑 LINK TO USER
//       name,
//       location,
//       description,
//       images: [],
//     });

//     const saved = await newMemory.save();
//     res.status(201).json(saved);
//   } catch (error) {
//     console.error("Error creating album:", error.message);
//     res.status(500).json({ message: "Failed to create album" });
//   }
// });

// // =========================
// // UPLOAD IMAGES (OWNERSHIP CHECK)
// // =========================
// router.put("/:id/upload", upload.array("images", 10), async (req, res) => {
//   try {
//     const memory = await Memory.findOne({
//       _id: req.params.id,
//       user: req.user._id,
//     });

//     if (!memory) {
//       return res.status(404).json({ message: "Album not found" });
//     }

//     const newImages = req.files.map((file) => `/uploads/${file.filename}`);
//     memory.images.push(...newImages);
//     await memory.save();

//     res.json(memory);
//   } catch (error) {
//     console.error("Error uploading images:", error.message);
//     res.status(500).json({ message: "Failed to upload images" });
//   }
// });

// // =========================
// // UPDATE album (OWNERSHIP CHECK)
// // =========================
// router.put("/:id", async (req, res) => {
//   try {
//     const { name, location, description, images } = req.body;

//     const updated = await Memory.findOneAndUpdate(
//       { _id: req.params.id, user: req.user._id },
//       { name, location, description, images },
//       { new: true }
//     );

//     if (!updated) {
//       return res.status(404).json({ message: "Album not found" });
//     }

//     res.json(updated);
//   } catch (error) {
//     console.error("Error updating album:", error.message);
//     res.status(500).json({ message: "Failed to update album" });
//   }
// });

// // =========================
// // DELETE album (OWNERSHIP CHECK)
// // =========================
// router.delete("/:id", async (req, res) => {
//   try {
//     const memory = await Memory.findOne({
//       _id: req.params.id,
//       user: req.user._id,
//     });

//     if (!memory) {
//       return res.status(404).json({ message: "Album not found" });
//     }

//     // Delete images from disk
//     memory.images.forEach((imgPath) => {
//       const fullPath = path.join(__dirname, "..", imgPath);
//       if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
//     });

//     await memory.deleteOne();
//     res.json({ message: "Album deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting album:", error.message);
//     res.status(500).json({ message: "Failed to delete album" });
//   }
// });

// module.exports = router;
