const mongoose = require("mongoose");

const preferenceSchema = new mongoose.Schema(
  {
    groupType: { type: String, required: true },
    tripType: { type: String, required: true },
    transportation: { type: String, required: true },
    accommodation: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Preference", preferenceSchema);
