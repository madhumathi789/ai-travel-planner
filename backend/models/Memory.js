const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema({
  name: String,
  location: String,
  description: String,
  images: [String],
});

module.exports = mongoose.model("Memory", memorySchema);

// const mongoose = require("mongoose");

// const memorySchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   name: String,
//   location: String,
//   description: String,
//   images: [String],
// });

// module.exports = mongoose.model("Memory", memorySchema);
