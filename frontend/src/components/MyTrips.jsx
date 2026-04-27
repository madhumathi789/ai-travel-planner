

// import React, { useEffect, useState } from "react";
// import "./MyTrips.css";

// const MyTrips = () => {
//   const [trips, setTrips] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTrips = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.error("No token found — please log in.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await fetch("http://localhost:5000/api/trips/my-trips", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const data = await response.json();
//         setTrips(data);
//       } catch (error) {
//         console.error("Error fetching trips:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTrips();
//   }, []);

//   // 🗑 Handle Delete
//   const handleDelete = async (tripId) => {
//     if (!window.confirm("Are you sure you want to delete this trip?")) return;

//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(`http://localhost:5000/api/trips/${tripId}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.ok) {
//         setTrips((prev) => prev.filter((trip) => trip._id !== tripId));
//       } else {
//         alert("Failed to delete trip. Try again.");
//       }
//     } catch (error) {
//       console.error("Error deleting trip:", error);
//     }
//   };

//   if (loading) return <div className="loading-trips">Loading your trips...</div>;

//   return (
//     <div className="my-trips-container">
//       <h2>My Trips</h2>

//       <div className="trips-grid">
//         {trips.length === 0 ? (
//           <p>No trips added yet.</p>
//         ) : (
//           trips.map((trip, index) => (
//             <div
//               key={index}
//               className="polaroid-card"
//               style={{
//                 backgroundImage: `url(${process.env.PUBLIC_URL + '/FQaSH.png'})`,
//                 backgroundSize: "cover",
//                 backgroundPosition: "center",
//                 backgroundRepeat: "no-repeat",
//               }}
//             >
//               <div className="map-emoji">📌</div>

//               <div className="polaroid-content">
//                 <h3>{trip.destinations?.[0]?.to || "Unknown Destination"}</h3>
//                 <p className="trip-info">
//                   {trip.destinations?.[0]?.from} → {trip.destinations?.[0]?.to}
//                 </p>
//                 <p className="trip-dates">
//                   🗓 {trip.startDate?.slice(0, 10)} - {trip.endDate?.slice(0, 10)}
//                 </p>
//                 <p className="trip-budget">💰 ₹{trip.budget?.toLocaleString()}</p>

//                 <div className="trip-actions">
//                   <button className="view-details-btn">👁 View</button>
//                   <button
//                     className="delete-btn"
//                     onClick={() => handleDelete(trip._id)}
//                   >
//                     🗑 Delete
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyTrips;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyTrips.css";

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found — please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/trips/my-trips", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        setTrips(data);
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  // 🗑 Handle Delete
  const handleDelete = async (tripId) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/trips/${tripId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setTrips((prev) => prev.filter((trip) => trip._id !== tripId));
      } else {
        alert("Failed to delete trip. Try again.");
      }
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  if (loading) return <div className="loading-trips">Loading your trips...</div>;

  return (
    <div className="my-trips-container">
      <h2>My Trips</h2>

      <div className="trips-grid">
        {trips.length === 0 ? (
          <p>No trips added yet.</p>
        ) : (
          trips.map((trip, index) => (
            <div
              key={index}
              className="polaroid-card"
              style={{
                backgroundImage: `url(${process.env.PUBLIC_URL + "/FQaSH.png"})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              <div className="map-emoji">📌</div>

              <div className="polaroid-content">
                <h3>{trip.destinations?.[0]?.to || "Unknown Destination"}</h3>
                <p className="trip-info">
                  {trip.destinations?.[0]?.from} → {trip.destinations?.[0]?.to}
                </p>
                <p className="trip-dates">
                  🗓 {trip.startDate?.slice(0, 10)} - {trip.endDate?.slice(0, 10)}
                </p>
                <p className="trip-budget">💰 ₹{trip.budget?.toLocaleString()}</p>

                <div className="trip-actions">
                  
                  {/* VIEW BUTTON */}
                  {trip.itineraryId ? (
                    <button
                      className="view-details-btn"
                      onClick={() => navigate(`/MyTrips/${trip.itineraryId}`)}
                    >
                      👁 View
                    </button>
                  ) : (
                    <button className="view-details-btn disabled">
                      ⏳ Generating...
                    </button>
                  )}

                  {/* DELETE BUTTON */}
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(trip._id)}
                  >
                    🗑 Delete
                  </button>

                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyTrips;
