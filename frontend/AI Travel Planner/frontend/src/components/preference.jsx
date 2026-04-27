import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./preference.css";
import API from "../api"; // ✅ axios instance

export default function Preference() {
  const navigate = useNavigate();
  const location = useLocation();

  const [preferences, setPreferences] = useState({
    groupType: "",
    tripType: "",
    transportation: "",
    accommodation: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setPreferences({
      ...preferences,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlanTrip = async () => {
    try {
      setLoading(true);

      // ✅ Save preferences to backend
      await API.post("/preferences", {
        ...preferences,
        tripDetails: location.state?.tripDetails || {},
      });

      //alert("Preferences saved successfully!");

      // ✅ Navigate to next page (keep your existing flow)
      navigate("/home", {
        state: {
          preferences,
          tripDetails: location.state?.tripDetails || {},
        },
      });
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Failed to save preferences. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trip-container">
      <div className="trip-card">
        <h2 className="trip-title">Your Preferences</h2>

        {/* Who are going? */}
        <div className="mb-4">
          <label className="label">Who are going?</label>
          <select
            name="groupType"
            className="input"
            value={preferences.groupType}
            onChange={handleChange}
            
          >
             <option value="" disabled hidden>
                Select Preference
              </option>
            {/* <option value="">Select Preference</option> */}
            <option value="solo">Solo Traveler</option>
            <option value="couple">Couple</option>
            <option value="friends">Friends Group</option>
            <option value="family">Family</option>
            <option value="corporate">Corporate Team</option>
          </select>
        </div>

        {/* Trip Type/Purpose */}
        <div className="mb-4">
          <label className="label">Trip Type/Purpose</label>
          <select
            name="tripType"
            className="input"
            value={preferences.tripType}
            onChange={handleChange}
          >
            <option value="" disabled hidden>
                Select Preference
              </option>
            {/* <option value="">Select Preference</option> */}
            <option value="adventure">Adventure</option>
            <option value="romantic">Romantic</option>
            <option value="relaxation">Relaxation</option>
            <option value="cultural">Cultural Exploration</option>
            <option value="wildlife">Wildlife & Nature</option>
            <option value="luxury">Luxury Experience</option>
            <option value="budget">Budget Travel</option>
            <option value="spiritual">Spiritual/Pilgrimage</option>
            <option value="business">Business/Work</option>
          </select>
        </div>

        {/* Transportation */}
        <div className="mb-4">
          <label className="label">Transportation</label>
          <select
            name="transportation"
            className="input"
            value={preferences.transportation}
            onChange={handleChange}
          >
            <option value="" disabled hidden>
                Select Preference
              </option>
            {/* <option value="">Select Preference</option> */}
            <option value="flight">Flight</option>
            <option value="train">Train</option>
            <option value="bus">Bus</option>
            <option value="car">Car Rental</option>
            <option value="bike">Bike/Scooter</option>
            <option value="mix">Mixed Transport</option>
          </select>
        </div>

        {/* Accommodation Preference */}
        <div className="mb-4">
          <label className="label">Accommodation Preference</label>
          <select
            name="accommodation"
            className="input"
            value={preferences.accommodation}
            onChange={handleChange}
          >
            <option value="" disabled hidden>
                Select Preference
              </option>
            {/* <option value="">Select Preference</option> */}
            <option value="budget-hotel">Budget Hotel</option>
            <option value="midrange-hotel">Mid-range Hotel</option>
            <option value="luxury-hotel">Luxury Hotel</option>
            <option value="resort">Resort</option>
            <option value="hostel">Hostel</option>
            <option value="homestay">Homestay</option>
            <option value="villa">Private Villa</option>
            <option value="camping">Camping/Glamping</option>
          </select>
        </div>

        {/* Plan your trip Button */}
        <button className="next-btn" onClick={handlePlanTrip} disabled={loading}>
          {loading ? "Saving..." : "Plan your trip"}
        </button>
      </div>
    </div>
  );
}
