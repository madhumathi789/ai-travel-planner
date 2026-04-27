// 
const Itinerary = require("../models/Itinerary");
const Trip = require("../models/Trip");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// REUSABLE - powerful retry system
async function callGemini(prompt) {
  const MAX_RETRIES = 4;
  const RETRY_DELAY = 1500;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      console.error(`❌ Gemini attempt ${attempt} failed:`, err.message);

      if (attempt === MAX_RETRIES) throw err;

      await new Promise((res) =>
        setTimeout(res, RETRY_DELAY * attempt)
      );
    }
  }
}

async function generateItineraryFn({
  tripId,
  destinations,
  startDate,
  endDate,
  budget,
  preferences,
}) {
  const prompt = `
Generate itinerary JSON:
Destinations: ${JSON.stringify(destinations)}
Start: ${startDate}
End: ${endDate}
Budget: ${budget}
Preferences: ${JSON.stringify(preferences)}

Output ONLY valid JSON:
{
  "title": "",
  "startDate": "",
  "endDate": "",
  "budget": "",
  "days": [],
  "transport": {},
  "stays": [],
  "packingList": [],
  "apps": []
}
`;

  try {
    // ⭐ Safe Gemini call with retry
    let aiText = await callGemini(prompt);

    // ⭐ CLEAN JSON OUTPUT
    let cleaned = aiText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .replace(/\*\*/g, "")
      .replace(/^[^{]*/, "") // remove everything before first {
      .replace(/[^}]*$/, ""); // remove everything after last }

    let itineraryJson;

    try {
      itineraryJson = JSON.parse(cleaned);
    } catch (err) {
      console.error("🔥 CLEANED JSON ERROR:", cleaned);
      throw new Error("AI returned invalid JSON");
    }

    // // ⭐ Save new itinerary
    // const savedItinerary = await new Itinerary({
    //   ...itineraryJson,
    //   destinations: destinations.map((d) => `${d.from} to ${d.to}`),
    // }).save();
    // ---- CLEAN APPS ----
// If Gemini returns objects → convert to strings
let apps = [];

if (Array.isArray(itineraryJson.apps)) {
  apps = itineraryJson.apps.map((item) => {
    if (typeof item === "string") return item; // already a string
    if (typeof item === "object" && item.name) return item.name; // convert {name, category..} → name
    return JSON.stringify(item); // fallback
  });
}

const savedItinerary = await new Itinerary({
  ...itineraryJson,
  apps,
  destinations: destinations.map(d => `${d.from} to ${d.to}`),
}).save();


    // ⭐ Link trip → itinerary
    if (tripId) {
      await Trip.findByIdAndUpdate(tripId, {
        itineraryId: savedItinerary._id,
      });
    }

    return savedItinerary;
  } catch (err) {
    console.error("❌ Final Itinerary Generation Error:", err);
    throw new Error("Itinerary generation failed");
  }
}

module.exports = generateItineraryFn;
