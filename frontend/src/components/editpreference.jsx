// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import "./editpreference.css";

// const EditPreference = () => {
//   const [formData, setFormData] = useState({
//     from: "",
//     to: "",
//     startDate: "",
//     endDate: "",
//     budget: "",
//     whoGoing: "",
//     tripType: "",
//     transportation: "",
//     accommodation: ""
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSave = () => {
//     // Save changes logic here
//     console.log("Preferences saved:", formData);
//   };

//   return (
//     <div className="edit-preference-container">
        
//       <main className="main-content">
//         <h2>Edit Preferences</h2>

//         <div className="form-group destination">
//           <label>Destination</label>
//           <div className="destination-inputs">
//             <input
//               type="text"
//               name="from"
//               placeholder="From"
//               value={formData.from}
//               onChange={handleChange}
//             />
//             <input
//               type="text"
//               name="to"
//               placeholder="To"
//               value={formData.to}
//               onChange={handleChange}
//             />
//           </div>
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label>Start Date</label>
//             <input
//               type="date"
//               name="startDate"
//               value={formData.startDate}
//               onChange={handleChange}
//             />
//           </div>
//           <div className="form-group">
//             <label>End Date</label>
//             <input
//               type="date"
//               name="endDate"
//               value={formData.endDate}
//               onChange={handleChange}
//             />
//           </div>
//           <div className="form-group">
//             <label>Budget</label>
//             <input
//               type="number"
//               name="budget"
//               placeholder="₹"
//               value={formData.budget}
//               onChange={handleChange}
//             />
//           </div>
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label>Who are Going</label>
//             <select
//               name="whoGoing"
//               value={formData.whoGoing}
//               onChange={handleChange}
//             >
//               <option value="">Select Preference</option>
//               <option value="family">Family</option>
//               <option value="friends">Friends</option>
//               <option value="solo">Solo</option>
//               <option value="couple">Couple</option>
//             </select>
//           </div>
//           <div className="form-group">
//             <label>Trip Type/Purpose</label>
//             <select
//               name="tripType"
//               value={formData.tripType}
//               onChange={handleChange}
//             >
//               <option value="">Select Preference</option>
//               <option value="leisure">Leisure</option>
//               <option value="business">Business</option>
//               <option value="adventure">Adventure</option>
//               <option value="cultural">Cultural</option>
//             </select>
//           </div>
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label>Transportation</label>
//             <select
//               name="transportation"
//               value={formData.transportation}
//               onChange={handleChange}
//             >
//               <option value="">Select Preference</option>
//               <option value="car">Car</option>
//               <option value="plane">Plane</option>
//               <option value="train">Train</option>
//               <option value="bus">Bus</option>
//             </select>
//           </div>
//           <div className="form-group">
//             <label>Accommodation</label>
//             <select
//               name="accommodation"
//               value={formData.accommodation}
//               onChange={handleChange}
//             >
//               <option value="">Select Preference</option>
//               <option value="hotel">Hotel</option>
//               <option value="hostel">Hostel</option>
//               <option value="apartment">Apartment</option>
//               <option value="camping">Camping</option>
//             </select>
//           </div>
//         </div>

//         <button className="save-btn" onClick={handleSave}>Save Changes</button>
//       </main>
//     </div>
//   );
// };

// export default EditPreference;

// 



import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./editpreference.css";

const EditPreference = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const passedTrip = location.state?.tripDetails;
  const [trip, setTrip] = useState(passedTrip || null);

  const [loading, setLoading] = useState(false); // 🔥 NEW: loading state

  const [formData, setFormData] = useState({
    from: "",
    to: "",
    startDate: "",
    endDate: "",
    budget: "",
    groupType: "",
    tripType: "",
    transportation: "",
    accommodation: "",
  });

  // Load trip + preload form
  useEffect(() => {
    const fetchTrip = async () => {
      if (trip) {
        setFormData({
          from: trip.destinations?.[0]?.from || "",
          to: trip.destinations?.[0]?.to || "",
          startDate: trip.startDate?.slice(0, 10) || "",
          endDate: trip.endDate?.slice(0, 10) || "",
          budget: trip.budget || "",
          groupType: trip.groupType || "",
          tripType: trip.tripType || "",
          transportation: trip.transportation || "",
          accommodation: trip.accommodation || "",
        });
        return;
      }

      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/trips/my-trips", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.length > 0) {
        const latest = data[0];
        setTrip(latest);

        setFormData({
          from: latest.destinations?.[0]?.from || "",
          to: latest.destinations?.[0]?.to || "",
          startDate: latest.startDate?.slice(0, 10) || "",
          endDate: latest.endDate?.slice(0, 10) || "",
          budget: latest.budget || "",
          groupType: latest.groupType || "",
          tripType: latest.tripType || "",
          transportation: latest.transportation || "",
          accommodation: latest.accommodation || "",
        });
      }
    };

    fetchTrip();
  }, [trip]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ⭐ Save + Regenerate itinerary
  const handleSave = async () => {
    if (!trip?._id) {
      alert("Trip ID missing.");
      return;
    }

    setLoading(true); // 🔥 show loading overlay

    const token = localStorage.getItem("token");

    const body = {
      tripId: trip._id,
      destinations: [{ from: formData.from, to: formData.to }],
      startDate: formData.startDate,
      endDate: formData.endDate,
      budget: formData.budget,
      preferences: formData,
    };

    try {
      // 1️⃣ Update preferences
      const res = await fetch("http://localhost:5000/api/preferences/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const updated = await res.json();

      // 2️⃣ Regenerate fresh itinerary
      const regen = await fetch("http://localhost:5000/api/generate-itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const newTrip = await regen.json();

      if (newTrip && newTrip._id) {
        navigate(`/home/${newTrip._id}`, { state: { tripDetails: newTrip } });
      } else {
        alert("Failed to regenerate itinerary.");
      }

    } catch (err) {
      console.error(err);
      alert("Error updating preferences.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-preference-container">
        <div className="content-blur-area">
      <main className="main-content">
        <h2>Edit Preferences</h2>

        {/* 🔥 Loading Overlay */}
        {loading && (
  <div className="loading-overlay">

    {/* SPARKLES */}
    <div className="sparkles">
      {Array.from({ length: 120 }).map((_, i) => {
        const shapes = ["★", "✦", "✧", "◆", "●"];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];

        return (
          <span
            key={i}
            className="sparkle"
            style={{
              left: Math.random() * 100 + "vw",
              top: -(Math.random() * 50) + "px",
              animationDelay: Math.random() * 4 + "s",
              fontSize: Math.random() * 14 + 10 + "px",
              color: [
                "#FFB3BA",
                "#FFDFBA",
                "#FFFFBA",
                "#BAFFC9",
                "#BAE1FF",
              ][Math.floor(Math.random() * 5)]
            }}
          >
            {shape}
          </span>
        );
      })}
    </div>

    {/* CENTER LOADING CIRCLE */}
    <div className="loader-container">
      <div className="rotating-circle"></div>
      <p className="loading-text">Updating your preferences...</p>
    </div>
  </div>
)}


        {/* Destination */}
        <div className="form-group destination">
          <label>Destination</label>
          <div className="destination-inputs">
            <input
              type="text"
              name="from"
              placeholder="From"
              value={formData.from}
              onChange={handleChange}
            />
            <input
              type="text"
              name="to"
              placeholder="To"
              value={formData.to}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Dates + Budget */}
        <div className="form-row">
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Budget</label>
            <input
              type="number"
              name="budget"
              placeholder="₹"
              value={formData.budget}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Group Type & Trip Type */}
        <div className="form-row">
          <div className="form-group">
            <label>Who are Going</label>
            <select name="groupType" value={formData.groupType} onChange={handleChange}>
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

          <div className="form-group">
            <label>Trip Type</label>
            <select name="tripType" value={formData.tripType} onChange={handleChange}>
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
        </div>

        {/* Transport + Stay */}
        <div className="form-row">
          <div className="form-group">
            <label>Transportation</label>
            <select
              name="transportation"
              value={formData.transportation}
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

          <div className="form-group">
            <label>Accommodation</label>
            <select
              name="accommodation"
              value={formData.accommodation}
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
        </div>

        <button className="save-btn" onClick={handleSave}>
          Save Changes & Regenerate Itinerary
        </button>
      </main>
      </div>
    </div>
  );
};

export default EditPreference;
