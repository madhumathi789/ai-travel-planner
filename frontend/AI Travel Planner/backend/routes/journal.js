const express = require("express");
const router = express.Router();
const Journal = require("../models/Journal");

// Get all notes
router.get("/", async (req, res) => {
  try {
    const notes = await Journal.find();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new note
router.post("/", async (req, res) => {
  try {
    const note = new Journal(req.body);
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update note
router.put("/:id", async (req, res) => {
  try {
    const updatedNote = await Journal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete note
router.delete("/:id", async (req, res) => {
  try {
    await Journal.findByIdAndDelete(req.params.id);
    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


// const express = require("express");
// const router = express.Router();
// const Journal = require("../models/Journal");
// const auth = require("../middleware/auth");

// // 🔐 PROTECT ALL JOURNAL ROUTES
// router.use(auth);

// // =========================
// // GET all notes (USER-SCOPED)
// // =========================
// router.get("/", async (req, res) => {
//   try {
//     const notes = await Journal.find({ user: req.user._id }).sort({ date: -1 });
//     res.json(notes);
//   } catch (err) {
//     console.error("Error fetching journals:", err.message);
//     res.status(500).json({ message: "Failed to fetch journals" });
//   }
// });

// // =========================
// // ADD new note
// // =========================
// router.post("/", async (req, res) => {
//   try {
//     const { title, content } = req.body;

//     if (!title || !content) {
//       return res.status(400).json({ message: "Title and content are required" });
//     }

//     const note = new Journal({
//       user: req.user._id, // 🔑 LINK TO USER
//       title,
//       content,
//     });

//     await note.save();
//     res.status(201).json(note);
//   } catch (err) {
//     console.error("Error creating journal:", err.message);
//     res.status(500).json({ message: "Failed to create journal" });
//   }
// });

// // =========================
// // UPDATE note (OWNERSHIP CHECK)
// // =========================
// router.put("/:id", async (req, res) => {
//   try {
//     const updatedNote = await Journal.findOneAndUpdate(
//       { _id: req.params.id, user: req.user._id },
//       req.body,
//       { new: true }
//     );

//     if (!updatedNote) {
//       return res.status(404).json({ message: "Journal not found" });
//     }

//     res.json(updatedNote);
//   } catch (err) {
//     console.error("Error updating journal:", err.message);
//     res.status(500).json({ message: "Failed to update journal" });
//   }
// });

// // =========================
// // DELETE note (OWNERSHIP CHECK)
// // =========================
// router.delete("/:id", async (req, res) => {
//   try {
//     const deleted = await Journal.findOneAndDelete({
//       _id: req.params.id,
//       user: req.user._id,
//     });

//     if (!deleted) {
//       return res.status(404).json({ message: "Journal not found" });
//     }

//     res.json({ message: "Note deleted successfully" });
//   } catch (err) {
//     console.error("Error deleting journal:", err.message);
//     res.status(500).json({ message: "Failed to delete journal" });
//   }
// });

// module.exports = router;
