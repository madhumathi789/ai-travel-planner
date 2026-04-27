const express = require("express");
const router = express.Router();
const Itinerary = require("../models/Itinerary");
const auth = require("../middleware/auth");

// 1️⃣ Get all trip summaries for this user
router.get("/", auth, async (req, res) => {
  try {
    const trips = await Itinerary.find({ user: req.user._id })
      .select("title destinations startDate endDate budget itineraryId createdAt")
      .sort({ createdAt: -1 });

    res.json(trips);
  } catch (err) {
    console.error("❌ Error loading trips:", err);
    res.status(500).json({ message: "Failed to load trips" });
  }
});

// 2️⃣ Get FULL budget details using itineraryId
router.get("/:tripId", auth, async (req, res) => {
  try {
    const trip = await Itinerary.findOne({
      _id: req.params.tripId,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json(trip); // return FULL itinerary
  } catch (err) {
    console.error("❌ Error loading full budget:", err);
    res.status(500).json({ message: "Failed to load full budget data" });
  }
});

module.exports = router;
