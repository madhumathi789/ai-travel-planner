// const express = require("express");
// const Trip = require("../models/Trip");
// const router = express.Router();

// router.get("/", async (req, res) => {
//   const trips = await Trip.find();
//   res.json(trips);
// });

// router.post("/", async (req, res) => {
//   const trip = new Trip(req.body);
//   await trip.save();
//   res.json(trip);
// });

// router.delete("/:id", async (req, res) => {
//   await Trip.findByIdAndDelete(req.params.id);
//   res.json({ message: "Trip deleted" });
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const Trip = require("../models/Trip");
const auth = require("../middleware/auth");

// ✅ Get all trips (Admin/testing)
router.get("/", async (req, res) => {
  try {
    const trips = await Trip.find().populate("user", "email username");
    res.json(trips);
  } catch (error) {
    console.error("Error fetching all trips:", error);
    res.status(500).json({ message: "Failed to fetch trips" });
  }
});

// ✅ Get logged-in user's trips
router.get("/my-trips", auth, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    console.error("Error fetching user's trips:", error);
    res.status(500).json({ message: "Failed to load user's trips" });
  }
});

// ✅ Create a new trip (for logged-in user)
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

// ✅ Delete a trip by ID (only if it belongs to the logged-in user)
router.delete("/:id", auth, async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user._id });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found or unauthorized" });
    }

    await trip.deleteOne();
    res.json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Error deleting trip:", error);
    res.status(500).json({ message: "Failed to delete trip" });
  }
});

module.exports = router;
