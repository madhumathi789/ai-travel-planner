const mongoose = require("mongoose");

const daySchema = new mongoose.Schema({
  day: Number,
  title: String,
  items: [
    {
      category: String,
      description: String,
      cost: Number
    }
  ],
  totalCost: Number
});

const budgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  tripTitle: String,
  location: String,
  startDate: String,
  endDate: String,
  duration: Number,

  totalBudget: Number,
  usedBudget: Number,
  remainingBudget: Number,

  dailyBreakdown: [daySchema],

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Budget", budgetSchema);
