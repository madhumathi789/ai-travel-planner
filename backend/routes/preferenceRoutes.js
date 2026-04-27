// const express = require("express");
// const router = express.Router();
// const Preference = require("../models/Preference");

// router.post("/", async (req, res) => {
//   try {
//     const preference = new Preference(req.body);
//     await preference.save();
//     res.status(201).json({ message: "Preferences saved successfully", preference });
//   } catch (err) {
//     console.error("Error saving preferences:", err.message);
//     res.status(500).json({ message: "Error saving preferences", error: err.message });
//   }
// });

// router.get("/", async (req, res) => {
//   try {
//     const prefs = await Preference.find();
//     res.json(prefs);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Preference = require("../models/Preference");
const Trip = require("../models/Trip");
const generateItineraryFn = require("../utils/generateItenary");


// --------------------------------------------------
// 1️⃣ SAVE INITIAL PREFERENCES (from /preference page)
// --------------------------------------------------
router.post("/", async (req, res) => {
  try {
    console.log("➡ Saving initial preferences:", req.body);

    const pref = new Preference(req.body);
    await pref.save();

    res.status(201).json({
      message: "Preferences saved successfully",
      preference: pref,
    });

  } catch (err) {
    console.error("💥 Initial preference save failed:", err);
    res.status(500).json({ message: "Failed to save preferences" });
  }
});


// --------------------------------------------------
// 2️⃣ EDIT PREFERENCES + REGENERATE ITINERARY
// --------------------------------------------------
router.post("/update", async (req, res) => {
  try {
    const { tripId, preferences, destinations, startDate, endDate, budget } = req.body;

    console.log("➡ Updating preferences for trip:", tripId);

    // Save new preferences (optional)
    const pref = new Preference(preferences);
    await pref.save();

    // Regenerate itinerary
    const newItinerary = await generateItineraryFn({
      tripId,
      destinations,
      startDate,
      endDate,
      budget,
      preferences,
    });

    // Update trip link
    await Trip.findByIdAndUpdate(tripId, {
      itineraryId: newItinerary._id,
    });

    return res.json({
      message: "Preferences updated & itinerary regenerated",
      itinerary: newItinerary,
    });

  } catch (err) {
    console.error("💥 Update failed:", err);
    res.status(500).json({
      message: "Failed to update preferences",
      error: err.message,
    });
  }
});

module.exports = router;
