const express = require("express");
const Trip = require("../models/Trip");
const router = express.Router();

// Get trips within a specific budget range
router.get("/", async (req, res) => {
  try {
    const { minBudget, maxBudget } = req.query;

    // Convert query params to numbers
    const min = parseInt(minBudget) || 0;
    const max = parseInt(maxBudget) || Number.MAX_SAFE_INTEGER;

    const trips = await Trip.find({
      budget: { $gte: min, $lte: max },
    });

    if (trips.length === 0)
      return res.status(404).json({ message: "No trips found in this range." });

    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a trip with a budget constraint
router.post("/", async (req, res) => {
  try {
    const { destinations, startDate, endDate, budget, savings } = req.body;

    if (!budget) {
      return res.status(400).json({ message: "Budget is required" });
    }

    const newTrip = new Trip({
      destinations,
      startDate,
      endDate,
      budget,
      savings,
    });

    const savedTrip = await newTrip.save();
    res.status(201).json(savedTrip);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
