// const mongoose = require("mongoose");

// const destinationSchema = new mongoose.Schema({
//   from: { type: String, required: true },
//   to: { type: String, required: true },
// });

// const tripSchema = new mongoose.Schema({
//   destinations: [destinationSchema],
//   startDate: { type: Date, required: true },
//   endDate: { type: Date, required: true },
//   budget: { type: Number, required: true },
//   personalBudget: { type: Number, default: 0 },
// });

// module.exports = mongoose.model("Trip", tripSchema);



const mongoose = require("mongoose");

const destinationSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
});

const tripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  destinations: [destinationSchema],
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  budget: { type: Number, required: true },
  personalBudget: { type: Number, default: 0 },

  // 🆕 Link to itinerary
  itineraryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Itinerary",
    default: null,
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Trip", tripSchema);
