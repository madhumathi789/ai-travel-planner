const express = require("express");
const Itinerary = require("../models/Itinerary");
const router = express.Router();

// 🟢 GET all itineraries
router.get("/", async (req, res) => {
  try {
    const itineraries = await Itinerary.find().sort({ createdAt: -1 });
    res.json(itineraries);
  } catch (error) {
    console.error("❌ Error fetching itineraries:", error);
    res.status(500).json({ message: "Failed to fetch itineraries" });
  }
});

// 🟢 GET itinerary by ID
router.get("/:id", async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id);
    if (!itinerary)
      return res.status(404).json({ message: "Itinerary not found" });
    res.json(itinerary);
  } catch (error) {
    console.error("❌ Error fetching itinerary:", error);
    res.status(500).json({ message: "Failed to fetch itinerary" });
  }
});

// 🟡 DELETE itinerary
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Itinerary.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Itinerary not found" });
    res.json({ message: "Itinerary deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting itinerary:", error);
    res.status(500).json({ message: "Failed to delete itinerary" });
  }
});

module.exports = router;
