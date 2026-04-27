// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "./TripSuccess.css";

// const TripSuccess = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // --- Your Existing Logic Starts Here ---
//   const stored = (() => {
//     try {
//       return JSON.parse(sessionStorage.getItem("lastTripData") || "null");
//     } catch {
//       return null;
//     }
//   })();

//   const initial = {
//     destinationName:
//       location.state?.destinationName ||
//       stored?.destinationName ||
//       "Your Trip",
//     startDate:
//       location.state?.startDate || stored?.startDate || "Start",
//     endDate:
//       location.state?.endDate || stored?.endDate || "End",
//     budget:
//       location.state?.budget || stored?.budget || "0",
//     description:
//       location.state?.description || stored?.description || ""
//   };

//   const [trip, setTrip] = useState(initial);
//   const [description, setDescription] = useState(initial.description);

//   useEffect(() => {
//     if (location.state) {
//       const merged = { ...trip, ...location.state };
//       setTrip(merged);
//       sessionStorage.setItem("lastTripData", JSON.stringify(merged));
//     }

//     if (!description) {
//       const gen = generateDescription(trip.destinationName);
//       setDescription(gen);
//       sessionStorage.setItem(
//         "lastTripData",
//         JSON.stringify({ ...trip, description: gen })
//       );
//     }
//     // eslint-disable-next-line
//   }, [location.state]);
//   // --- Your Existing Logic Ends Here ---

//   // --- Animation Helper Functions ---
//   const renderSparks = () => {
//     const sparks = [];
//     for (let i = 0; i < 50; i++) {
//       const style = {
//         left: `${Math.random() * 100}%`,
//         animationDelay: `${Math.random() * 2}s`,
//         animationDuration: `${Math.random() * 2 + 2}s`,
//         backgroundColor: getRandomColor(),
//       };
//       sparks.push(<div key={i} className="spark" style={style}></div>);
//     }
//     return sparks;
//   };

//   const getRandomColor = () => {
//     const colors = ['#FFD700', '#FF4500', '#00BFFF', '#32CD32', '#FF69B4'];
//     return colors[Math.floor(Math.random() * colors.length)];
//   };

//   return (
//       <main className="main-content">
        
//         {/* Green Trip Header with Dynamic Data */}
//         <div className="trip-header">
//           <div className="trip-info">
//             <h1>{trip.destinationName}</h1>
//             <p>{trip.startDate} - {trip.endDate}</p>
//           </div>
//           <div className="trip-budget">
//             <span>Total Budget</span>
//             <h2>₹ {trip.budget}</h2>
//           </div>
//         </div>

//         {/* Success Card with Animation */}
//         <div className="success-container">
//           <div className="success-card">
//             {/* The falling sparks container */}
//             <div className="sparks-overlay">
//               {renderSparks()}
//             </div>
            
//             <div className="success-content">
//               <h3>{trip.destinationName} successfully completed!</h3>
//               <p className="success-description-text">
//                 {description}
//               </p>
//             </div>
//           </div>

//           {/* CTA Button using your navigate logic */}
//           <button 
//             className="plan-next-btn"
//             onClick={() => navigate("/")}
//           >
//             Plan Your Next Trip Now
//           </button>
//         </div>

//       </main>
//   );
// };

// // --- Your Helper Function ---
// function generateDescription(destination) {
//   const templates = [
//     `From misty tea gardens to heritage streets, ${destination} gave us memories soaked in green, spice, and sunsets.`,
//     `${destination} unfolded like a storybook — calm backwaters, busy lanes, and golden evenings.`,
//     `We wandered through ${destination}, collecting flavors, views, and moments that stayed with us.`
//   ];
//   const sum = destination
//     .split("")
//     .reduce((s, c) => s + c.charCodeAt(0), 0);
//   return templates[sum % templates.length];
// }

// export default TripSuccess;
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./TripSuccess.css";

const TripSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // --- Retrieve stored trip data ---
  const storedTrip = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("lastTripData") || "null");
    } catch {
      return null;
    }
  })();

  // --- Trip state: default to storedTrip or safe empty values ---
  const [trip, setTrip] = useState({
    destinationName: storedTrip?.destinationName || "Your Trip",
    startDate: storedTrip?.startDate || "Start",
    endDate: storedTrip?.endDate || "End",
    budget: storedTrip?.budget || "0",
    description: storedTrip?.description || "",
    days: storedTrip?.days || [],
    stays: storedTrip?.stays || [],
    transport: storedTrip?.transport || [],
  });

  const [description, setDescription] = useState(trip.description);

  // --- Update trip and persist to sessionStorage ---
  useEffect(() => {
    let updatedTrip = { ...trip };

    if (location.state) {
      updatedTrip = {
        ...updatedTrip,
        ...location.state,
        // Keep arrays from storedTrip if not present in location.state
        days: location.state.days ?? updatedTrip.days,
        stays: location.state.stays ?? updatedTrip.stays,
        transport: location.state.transport ?? updatedTrip.transport,
      };
      setTrip(updatedTrip);
    }

    if (!description) {
      const genDesc = generateDescription(updatedTrip.destinationName);
      setDescription(genDesc);
      updatedTrip.description = genDesc;
    }

    // Persist full trip object safely
    sessionStorage.setItem("lastTripData", JSON.stringify(updatedTrip));
    // eslint-disable-next-line
  }, [location.state]);

  const renderSparks = () =>
    Array.from({ length: 50 }).map((_, i) => {
      const style = {
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 2}s`,
        animationDuration: `${Math.random() * 2 + 2}s`,
        backgroundColor: getRandomColor(),
      };
      return <div key={i} className="spark" style={style}></div>;
    });

  const getRandomColor = () => {
    const colors = ["#FFD700", "#FF4500", "#00BFFF", "#32CD32", "#FF69B4"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <main className="main-content">
      {/* Trip Header */}
      <div className="trip-header">
        <div className="trip-info">
          <h1>{trip.destinationName}</h1>
          <p>{trip.startDate} - {trip.endDate}</p>
        </div>
        <div className="trip-budget">
          <span>Total Budget</span>
          <h2>₹ {trip.budget}</h2>
        </div>
      </div>

      {/* Success Card */}
      <div className="success-container">
        <div className="success-card">
          <div className="sparks-overlay">{renderSparks()}</div>
          <div className="success-content">
            <h3>{trip.destinationName} successfully completed!</h3>
            <p className="success-description-text">{description}</p>
          </div>
        </div>

        <button className="plan-next-btn" onClick={() => navigate("/")}>
          Plan Your Next Trip Now
        </button>
      </div>
    </main>
  );
};

function generateDescription(destination) {
  const templates = [
    `From misty tea gardens to heritage streets, ${destination} gave us memories soaked in green, spice, and sunsets.`,
    `${destination} unfolded like a storybook — calm backwaters, busy lanes, and golden evenings.`,
    `We wandered through ${destination}, collecting flavors, views, and moments that stayed with us.`,
  ];
  const sum = destination.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  return templates[sum % templates.length];
}

export default TripSuccess;
