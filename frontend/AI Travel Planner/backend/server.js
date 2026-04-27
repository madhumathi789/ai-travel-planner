// // --- MODULES & SETUP ---
// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const path = require("path");
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// // Load environment variables FIRST
// dotenv.config();

// // Import DB connection & routes
// const connectDB = require("./db/connect");
// const authRoutes = require("./routes/auth");
// const tripRoutes = require("./routes/trips");
// const budgetTripRoutes = require("./routes/budgetTrips");
// const journalRoutes = require("./routes/journal");
// const preferenceRoutes = require("./routes/preferenceRoutes");
// const memoryRoutes = require("./routes/memory");
// const itineraryRoutes = require("./routes/itineraryRoutes"); // ✅ Existing route
// const Itinerary = require("./models/Itinerary"); // ✅ Added model import
// const userProfileRoutes = require("./routes/userRoutes.js");

// // Initialize Express app
// const app = express();

// // --- GEMINI AI SETUP ---
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// if (!GEMINI_API_KEY) {
//   console.error("❌ ERROR: GEMINI_API_KEY not set in environment variables.");
// }

// const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// // --- MIDDLEWARE ---
// app.use(cors());
// app.use(express.json());
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // --- DATABASE CONNECTION ---
// connectDB();

// // --- AI ITINERARY CONTROLLER ---
// const generateItinerary = async (req, res) => {
//   const { tripId, destinations, startDate, endDate, budget, preferences } = req.body;

//   const prompt = `
// You are an AI travel planner specializing in International travel.
// Generate a detailed, realistic itinerary in JSON format.

// User Details:
// Destination(s): ${JSON.stringify(destinations)}
// Start Date: ${startDate}
// End Date: ${endDate}
// Budget: ${budget}
// Traveler Preferences: ${JSON.stringify(preferences)}

// Required JSON structure:
// {
//   "title": "Trip to [destination]",
//   "startDate": "[YYYY-MM-DD]",
//   "endDate": "[YYYY-MM-DD]",
//   "budget": "[INR]",
//   "days": [
//     {
//       "day": "Day 1",
//       "date": "[YYYY-MM-DD]",
//       "title": "Main highlight",
//       "activities": [
//         { "name": "Visit X Temple", "price": "500" },
//         { "name": "Dinner at Y", "price": "2000" }
//       ]
//     }
//   ],
//   "transport": {
//       "type": "Train/Bus/Flight",
//       "detail": "Konkan Kanya Express, AC 3-Tier",
//       "price": "12000"
//   },
//   "stays": [
//       { "detail": "4 nights at The Tamarind Hotel, Vagator", "price": "18000" }
//   ],
//   "packingList": ["Clothes", "Toiletries", "Powerbank"],
//   "apps": ["Google Maps", "Ola/Uber", "Zomato"]
// }
// `;

//   try {
//     const result = await model.generateContent(prompt);
//     const text = result.response.text();

//     // let itinerary;
//     // try {
//     //   itinerary = JSON.parse(text.trim());
//     // } catch (err) {
//     //   const cleaned = text.replace(/```json|```/g, "").trim();
//     //   itinerary = JSON.parse(cleaned);
//     // }
//     // ⭐ FIXED JSON CLEANING SECTION
//     let cleaned = text
//       .replace(/```json/gi, "")
//       .replace(/```/g, "")
//       .replace(/\*\*/g, "")
//       .replace(/^[^{]*/, "")
//       .replace(/[^}]*$/, "");

//     let itinerary = JSON.parse(cleaned);

//     // ✅ Save itinerary to DB
//     const newItinerary = new Itinerary({
//       title: itinerary.title,
//       startDate: itinerary.startDate,
//       endDate: itinerary.endDate,
//       budget: itinerary.budget,
//       destinations: destinations.map((d) => `${d.from} to ${d.to}`),
//       transport: itinerary.transport,
//       stays: itinerary.stays,
//       packingList: itinerary.packingList,
//       apps: itinerary.apps,
//       days: itinerary.days,
//     });

//     const savedItinerary = await newItinerary.save();
//     console.log("✅ Itinerary saved:", savedItinerary._id);

//     // ✅ Link itinerary with the trip
//     if (tripId) {
//       const Trip = require("./models/Trip");
//       await Trip.findByIdAndUpdate(tripId, { itineraryId: savedItinerary._id });
//       console.log("🔗 Linked itinerary to trip:", tripId);
//     }

//     res.json(savedItinerary);
//   } catch (error) {
//     console.error("❌ Itinerary generation failed:", error);
//     res.status(500).json({ message: "Failed to generate itinerary", error: error.message });
//   }
// };


// // --- ROUTE MOUNTING ---
// app.use("/api/auth", authRoutes);
// app.use("/api/trips", tripRoutes);
// app.use("/api/budget-trips", budgetTripRoutes);
// app.use("/api/journal", journalRoutes);
// app.use("/api/preferences", preferenceRoutes);
// app.use("/api/memories", memoryRoutes);
// app.use("/api/itineraries", itineraryRoutes); // ✅ Already added
// app.use("/api/user", userProfileRoutes);


// // AI Generation Route
// app.post("/api/generate-itinerary", generateItinerary);

// // --- ROOT & ERROR HANDLING ---
// app.get("/", (req, res) => {
//   res.send("🌍 TravelZen API running! Try /api/generate-itinerary or /api/itineraries");
// });

// app.use((err, req, res, next) => {
//   console.error("Error:", err.message);
//   res.status(500).json({ message: "Internal Server Error", error: err.message });
// });

// // --- START SERVER ---
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`✅ Server running on http://localhost:${PORT}`);
// });
// server.js (cleaned & fixed)

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables FIRST
dotenv.config();

// Initialize Express app
const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- DATABASE CONNECTION ---
const connectDB = require("./db/connect");

// Connect DB and only then start server
connectDB()
  .then(() => {
    console.log("✅ Database connected");
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    // still continue to allow logs to appear; in prod you may want to exit
  });

// --- GEMINI AI SETUP (optional) ---
let model = null;
try {
  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    console.warn("⚠️ GEMINI_API_KEY not set — AI features will be disabled");
  } else {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    console.log("✅ Gemini model initialized");
  }
} catch (e) {
  // If package isn't installed or fails, don't crash the server
  console.warn("⚠️ GoogleGenerativeAI not initialized:", e.message);
}

// --- IMPORT ROUTES ---
const authRoutes = require("./routes/auth");
const tripRoutes = require("./routes/trips");
const budgetRoutes = require("./routes/budgetRoutes"); // Itinerary-based budget routes
const journalRoutes = require("./routes/journal");
const preferenceRoutes = require("./routes/preferenceRoutes"); // fixed require
const memoryRoutes = require("./routes/memory");
const itineraryRoutes = require("./routes/itineraryRoutes");
const userProfileRoutes = require("./routes/userRoutes");

// --- AI ITINERARY CONTROLLER (keeps your existing implementation) ---
const Itinerary = require("./models/Itinerary");
const generateItinerary = async (req, res) => {
  if (!model) {
    return res.status(500).json({ message: "AI model not configured" });
  }

  const { tripId, destinations, startDate, endDate, budget, preferences } = req.body;
  const prompt = `
You are an AI travel planner specializing in Indian travel.
Generate a detailed, realistic itinerary in JSON format.

User Details:
Destination(s): ${JSON.stringify(destinations)}
Start Date: ${startDate}
End Date: ${endDate}
Budget: ${budget}
Traveler Preferences: ${JSON.stringify(preferences)}

Required JSON structure:
{
  "title": "Trip to [destination]",
  "startDate": "[YYYY-MM-DD]",
  "endDate": "[YYYY-MM-DD]",
  "budget": "[INR]",
  "days": [
    {
      "day": "Day 1",
      "date": "[YYYY-MM-DD]",
      "title": "Main highlight",
      "activities": [
        { "name": "Visit X Temple", "price": "500" },
        { "name": "Dinner at Y", "price": "2000" }
      ]
    }
  ],
  "transport": { "type": "Train/Bus/Flight", "detail": "AC 3-Tier", "price": "12000" },
  "stays": [{ "detail": "4 nights at hotel", "price": "18000" }],
  "packingList": ["Clothes", "Toiletries"],
  "apps": ["Google Maps", "Zomato"]
}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    let cleaned = text
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .replace(/\*\*/g, "")
      .replace(/^[^{]*/, "")
      .replace(/[^}]*$/, "");

    const itinerary = JSON.parse(cleaned);

    const newItinerary = new Itinerary({
      title: itinerary.title,
      startDate: itinerary.startDate,
      endDate: itinerary.endDate,
      budget: itinerary.budget,
      destinations: destinations.map((d) => `${d.from} to ${d.to}`),
      transport: itinerary.transport,
      stays: itinerary.stays,
      packingList: itinerary.packingList,
      apps: itinerary.apps,
      days: itinerary.days,
      user: req.user ? req.user._id : undefined, // optional attach user if available (auth middleware not used here)
    });

    const savedItinerary = await newItinerary.save();
    console.log("✅ Itinerary saved:", savedItinerary._id);

    if (tripId) {
      const Trip = require("./models/Trip");
      await Trip.findByIdAndUpdate(tripId, { itineraryId: savedItinerary._id });
      console.log("🔗 Linked itinerary to trip:", tripId);
    }

    res.json(savedItinerary);
  } catch (error) {
    console.error("❌ Itinerary generation failed:", error);
    res.status(500).json({ message: "Failed to generate itinerary", error: error.message });
  }
};

// --- ROUTES MOUNTING ---
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/budget", budgetRoutes);            // important: itinerary-based budget endpoints
app.use("/api/journal", journalRoutes);
app.use("/api/preferences", preferenceRoutes);
app.use("/api/memories", memoryRoutes);
app.use("/api/itineraries", itineraryRoutes);
app.use("/api/user", userProfileRoutes);

// AI Itinerary route (leave it at end or wherever you prefer)
app.post("/api/generate-itinerary", generateItinerary);

// --- ROOT & ERROR HANDLING ---
app.get("/", (req, res) => {
  res.send("🌍 TravelZen API running! All systems ready.");
});

// Basic global error handler
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

// --- START SERVER ---
// Wait a short moment to allow DB connection logs to print, then start listening.
// (connectDB above already attempts connection)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log("Mounted routes:");
  console.log("  /api/auth");
  console.log("  /api/trips");
  console.log("  /api/budget");
  console.log("  /api/journal");
  console.log("  /api/preferences");
  console.log("  /api/memories");
  console.log("  /api/itineraries");
  console.log("  /api/user");
});

module.exports = app;
