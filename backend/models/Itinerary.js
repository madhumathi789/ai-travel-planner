const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  name: String,
  price: String,
});

const daySchema = new mongoose.Schema({
  day: String,
  date: String,
  title: String,
  activities: [activitySchema],
});

const itinerarySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    budget: { type: String },
    destinations: [String],
    transport: {
      type: { type: String },
      detail: String,
      price: String,
    },
    stays: [
      {
        detail: String,
        price: String,
      },
    ],
    packingList: [String],
    apps: [String],
    days: [daySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Itinerary", itinerarySchema);
