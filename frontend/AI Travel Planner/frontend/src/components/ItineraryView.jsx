// // 

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import "./MyTrips.css"; // reuse same styles

// const ItineraryView = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [itinerary, setItinerary] = useState(null);

//   useEffect(() => {
//     const fetchItinerary = async () => {
//       const res = await fetch(`http://localhost:5000/api/itineraries/${id}`);
//       const data = await res.json();
//       setItinerary(data);
//     };
//     fetchItinerary();
//   }, [id]);

//   if (!itinerary) return <p>Loading…</p>;

//   // Format AI object output into readable strings
//   const fmt = (val) => {
//     if (!val) return "";
//     if (typeof val === "string") return val;
//     if (typeof val === "number") return val;

//     if (typeof val === "object") {
//       if (val.name && val.time) return `${val.name} — ${val.time}`;
//       if (val.name) return val.name;
//       if (val.title) return val.title;
//       return Object.values(val).join(", ");
//     }

//     return String(val);
//   };

//   return (
//     <div className="my-trips-container">
//       <h2>Itinerary</h2>

//       <button
//         className="view-details-btn"
//         style={{ marginBottom: "20px" }}
//         onClick={() => navigate("/MyTrips")}
//       >
//         ← Back
//       </button>

//       {/* ⭐ EXACT same polaroid card as MyTrips */}
//       <div
//         className="polaroid-card"
//         style={{
//           width: "90%",
//           maxWidth: "700px",
//           margin: "0 auto",
//           backgroundImage: `url(${process.env.PUBLIC_URL + "/FQaSH.png"})`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           backgroundRepeat: "no-repeat",
//         }}
//       >
//         {/* Map pin / emoji same positioning */}
//         <div className="map-emoji">📌</div>

//         {/* Polaroid inner content box */}
//         <div className="polaroid-content">

//           <h3>{itinerary.title}</h3>

//           <p className="trip-dates">
//             🗓 {itinerary.startDate?.slice(0, 10)} –{" "}
//             {itinerary.endDate?.slice(0, 10)}
//           </p>

//           <p className="trip-budget">
//             💰 ₹{itinerary.budget?.toLocaleString()}
//           </p>

//           <br />

//           <h3 style={{ color: "#004d40" }}>Days</h3>

//           {itinerary.days?.map((day, i) => (
//             <div
//               key={i}
//               style={{
//                 textAlign: "left",
//                 marginTop: "15px",
//                 background: "rgba(255,255,255,0.7)",
//                 padding: "10px 15px",
//                 borderRadius: "8px",
//               }}
//             >
//               <strong style={{ color: "#00796b" }}>Day {i + 1}</strong>

//               <ul style={{ marginTop: "8px" }}>
//                 {day.activities?.map((a, idx) => (
//                   <li key={idx} style={{ fontSize: "0.9rem" }}>
//                     {fmt(a)}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}

//           <br />

//           <h3 style={{ color: "#004d40" }}>Packing List</h3>
//           <ul style={{ textAlign: "left" }}>
//             {itinerary.packingList?.map((p, i) => (
//               <li key={i}>{fmt(p)}</li>
//             ))}
//           </ul>

//           <br />

//           <h3 style={{ color: "#004d40" }}>Apps</h3>
//           <ul style={{ textAlign: "left" }}>
//             {itinerary.apps?.map((a, i) => (
//               <li key={i}>{fmt(a)}</li>
//             ))}
//           </ul>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default ItineraryView;


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Home.css"; // Use your itinerary page styling, NOT polaroid

const ItineraryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [itinerary, setItinerary] = useState(null);

  useEffect(() => {
    const fetchItinerary = async () => {
      const res = await fetch(`http://localhost:5000/api/itineraries/${id}`);
      const data = await res.json();
      setItinerary(data);
    };
    fetchItinerary();
  }, [id]);

  if (!itinerary) return <p>Loading…</p>;

  const fmt = (val) => {
    if (!val) return "";
    if (typeof val === "string") return val;
    if (typeof val === "number") return val;

    if (typeof val === "object") {
      if (val.name) return val.name;
      if (val.title) return val.title;
      return Object.values(val).join(", ");
    }

    return String(val);
  };

  return (
    <div className="home-container" style={{ paddingLeft: "40px", paddingRight: "40px" }}>
      <main className="main-content" style={{ paddingTop: "30px" }}>

        {/* Back Button */}
        <button className="back-btn" onClick={() => navigate("/MyTrip")}>
          ← Back
        </button>

        {/* FULL WIDTH header */}
        <div className="trip-header" style={{ marginTop: "10px" }}>
          <h1 style={{ textAlign: "center" }}>{itinerary.title}</h1>
          <div className="trip-meta" style={{ textAlign: "center" }}>
            <span>
              {itinerary.startDate?.slice(0,10)} — {itinerary.endDate?.slice(0,10)}
            </span>
            <span className="budget" style={{ display: "block", marginTop: "5px" }}>
              💰 ₹{itinerary.budget}
            </span>
          </div>
        </div>

        {/* FULL WIDTH content box */}
        <div
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.9)",
            padding: "25px",
            borderRadius: "12px",
            marginTop: "35px",
            boxShadow: "0px 4px 15px rgba(0,0,0,0.1)"
          }}
        >
          <h2 style={{ color: "#00695c", marginBottom: "15px" }}>Days</h2>

          {/* Each Day */}
          {itinerary.days?.map((day, i) => (
            <div
              key={i}
              style={{
                background: "white",
                padding: "18px 22px",
                borderRadius: "10px",
                marginBottom: "18px",
                border: "1px solid #e0e0e0"
              }}
            >
              <h3 style={{ color: "#00796b", marginBottom: "8px" }}>
                Day {i + 1}
              </h3>

              <ul style={{ marginLeft: "18px" }}>
                {day.activities?.map((a, idx) => (
                  <li
                    key={idx}
                    style={{
                      fontSize: "0.95rem",
                      lineHeight: "1.5",
                      marginBottom: "6px"
                    }}
                  >
                    {fmt(a)}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Packing List */}
          <h2 style={{ marginTop: "30px", color: "#00695c" }}>Packing List</h2>
          <ul style={{ marginLeft: "25px" }}>
            {itinerary.packingList?.map((p, i) => (
              <li key={i} style={{ marginBottom: "8px" }}>
                {fmt(p)}
              </li>
            ))}
          </ul>

          {/* Apps */}
          <h2 style={{ marginTop: "25px", color: "#00695c" }}>Essential Apps</h2>
          <ul style={{ marginLeft: "25px" }}>
            {itinerary.apps?.map((a, i) => (
              <li key={i} style={{ marginBottom: "8px" }}>
                {fmt(a)}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default ItineraryView;
