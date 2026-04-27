const express = require("express");
const router = express.Router();
const Trip = require("../models/Trip");
const auth = require("../middleware/auth");

// ✅ Save a new trip for the logged-in user
router.post("/", auth, async (req, res) => {
  try {
    const { destinations, startDate, endDate, budget, personalBudget } = req.body;

    const newTrip = new Trip({
      user: req.user._id,
      destinations,
      startDate,
      endDate,
      budget,
      personalBudget,
    });

    await newTrip.save();
    res.status(201).json(newTrip);
  } catch (error) {
    console.error("Error saving trip:", error);
    res.status(500).json({ message: "Failed to save trip" });
  }
});

// ✅ Fetch all trips for a logged-in user
router.get("/my-trips", auth, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    console.error("Error fetching trips:", error);
    res.status(500).json({ message: "Failed to load trips" });
  }
});

module.exports = router;
