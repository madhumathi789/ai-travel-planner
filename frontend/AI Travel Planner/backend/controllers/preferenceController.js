const Preference = require("../models/Preference");

// @desc    Save or Update user preferences
// @route   POST /api/preferences
// @access  Private
const savePreferences = async (req, res) => {
  const { groupType, tripType, transportation, accommodation } = req.body;

  // Basic input validation
  if (!groupType || !tripType || !transportation || !accommodation) {
    return res.status(400).json({ message: "Please fill out all preference fields." });
  }

  try {
    // We want to upsert (Update if exists, Insert if new) based on the user ID.
    // This ensures a user only has one set of current preferences.
    const preference = await Preference.findOneAndUpdate(
      { user: req.user.id }, // Find preferences belonging to the authenticated user
      {
        groupType,
        tripType,
        transportation,
        accommodation,
      },
      {
        new: true, // Return the new, updated document
        upsert: true, // Create the document if it doesn't exist
        runValidators: true, // Run schema validators on update
      }
    );

    res.status(200).json({
      message: "Preferences saved successfully!",
      data: preference,
    });
  } catch (error) {
    console.error("Error saving preferences:", error);
    res.status(500).json({ message: "Server error during preference saving.", error: error.message });
  }
};

// @desc    Get user preferences
// @route   GET /api/preferences
// @access  Private
const getPreferences = async (req, res) => {
  try {
    const preferences = await Preference.findOne({ user: req.user.id });

    if (!preferences) {
      return res.status(404).json({ message: "No preferences found for this user." });
    }

    res.status(200).json({ data: preferences });
  } catch (error) {
    console.error("Error fetching preferences:", error);
    res.status(500).json({ message: "Server error during preference retrieval.", error: error.message });
  }
};


module.exports = {
  savePreferences,
  getPreferences,
};
