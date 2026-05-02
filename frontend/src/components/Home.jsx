import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams(); // if viewing saved itinerary
  const { tripDetails, preferences } = location.state || {};

  const [trip, setTrip] = useState(null);
  const [activeDay, setActiveDay] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showTripSuccess, setShowTripSuccess] = useState(false); // NEW: toggle success page

  const [spentItems, setSpentItems] = useState(() => {
    const saved = localStorage.getItem("spentItems");
    return saved ? JSON.parse(saved) : {};
  });

  // --- Checklist ---
  const handleItemToggle = (id, price) => {
    setSpentItems((prev) => {
      const updated = { ...prev };
      const num = parseFloat(String(price).replace(/[^0-9.]/g, "")) || 0;

      if (updated[id]) delete updated[id];
      else updated[id] = num;

      return updated;
    });
  };

  const calculateTotalSpent = () =>
    Object.values(spentItems).reduce((a, b) => a + b, 0);

  // ========================
  // ⭐ 1. VIEWING SAVED TRIP
  // ========================
  useEffect(() => {
    if (!id) return;

    const fetchSaved = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/itineraries/${id}`);
        const data = await res.json();
        setTrip(data);
        setSpentItems({});
        localStorage.removeItem("spentItems");
      } catch (err) {
        console.error("Failed to load saved itinerary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, [id]);

  // ========================================
  // ⭐ 2. GENERATING A NEW ITINERARY (Home)
  // ========================================
  useEffect(() => {
    if (id) return; // skip if viewing saved itinerary

    if (!tripDetails) {
      setLoading(false);
      return;
    }

    const generate = async () => {
      try {
        // 🔥 Reset spent items when generating a NEW itinerary
        localStorage.setItem("spentItems", JSON.stringify({}));
        setSpentItems({});
        const response = await fetch("http://localhost:5000/api/generate-itinerary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tripId: tripDetails._id,
            destinations: tripDetails.destinations,
            startDate: tripDetails.startDate,
            endDate: tripDetails.endDate,
            budget: tripDetails.budget,
            preferences,
          }),
        });

        const data = await response.json();
        setTrip(data);
      } catch (err) {
        console.error("Generation error:", err);
        setTrip(null);
      } finally {
        setLoading(false);
      }
    };

    generate();
  }, [id, tripDetails, preferences]);

  // ====================================================
  // ⭐ 3. LOAD LAST ITINERARY IF HOME IS EMPTY
  // ====================================================
  useEffect(() => {
    if (id || tripDetails) return;

    const loadLast = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/itineraries");
        const list = await res.json();
        if (list.length > 0) {
          setTrip(list[0]); // newest itinerary
        }
      } catch (err) {
        console.error("Failed loading last itinerary:", err);
      } finally {
        setLoading(false);
      }
    };

    loadLast();
  }, [id, tripDetails]);

  // 🧩 Persist checklist
  useEffect(() => {
    localStorage.setItem("spentItems", JSON.stringify(spentItems));
  }, [spentItems]);

  // ================================
  // ⭐ FUN LOADING ANIMATION
  if (loading) {
    return (
      <div className="loading-overlay">
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
                    "#Baffc9",
                    "#bae1ff",
                  ][Math.floor(Math.random() * 5)],
                }}
              >
                {shape}
              </span>
            );
          })}
        </div>
        <div className="loading-box">
          <div className="loading-circle"></div>
          <p className="loading-text">⭐ Generating your perfect itinerary...</p>
        </div>
      </div>
    );
  }

  if (!trip) return <div className="error">❌ Could not load itinerary.</div>;

  // ================================
  // ⭐ DAYS BAR
  // ================================
  const itineraryDays = [
    { day: "Pre-Trip", date: trip.startDate, title: "Setup & Essential Booking" },
    ...(trip.days || []),
  ];

  // ================================
  // ⭐ RENDER TRIP SUCCESS (INLINE)
  // ================================
  const renderTripSuccess = () => {
    const totalSpent = calculateTotalSpent();
    const description =
      trip.description || generateDescription(trip.title || trip.destinationName);

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

    function getRandomColor() {
      const colors = ["#FFD700", "#FF4500", "#00BFFF", "#32CD32", "#FF69B4"];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    return (
      <div className="success-container">
        <div className="success-card">
          <div className="sparks-overlay">{renderSparks()}</div>
          <div className="success-content">
            <h3>Your Trip successfully completed!</h3>
            <p className="success-description-text">{description}</p>
          </div>
        </div>

        <button
          className="plan-next-btn"
          onClick={() => navigate("/tripdetails")} // go to landing page
        >
          Plan Your Next Trip Now
        </button>
      </div>
    );
  };

  // ================================
  // ⭐ RENDER ITINERARY CONTENT
  // ================================
  const renderItineraryContent = () => {
    const total = calculateTotalSpent();
    const formatted = total.toLocaleString();

    const ChecklistItem = ({ id, text, price }) => {
      const numeric = parseFloat(String(price).replace(/[^0-9.]/g, "")) || 0;
      return (
        <li className={spentItems[id] ? "checked" : ""}>
          <label>
            <input
              type="checkbox"
              checked={!!spentItems[id]}
              onChange={() => handleItemToggle(id, price)}
            />
            <span className="item-text">{text}</span>
            <span className="item-price">₹{numeric.toLocaleString()}</span>
          </label>
        </li>
      );
    };

    // --- Pre-trip page ---
    if (activeDay === 0) {
      return (
        <div className="itinerary-sections">
          <div className="budget-summary-floating">Current Spent: ₹{formatted}</div>
          <section className="itinerary-section">
            <h2>🚗 Transport</h2>
            <ul className="list checklist-list">
              <ChecklistItem
                id="transport"
                text={trip.transport?.detail}
                price={trip.transport?.price}
              />
            </ul>
          </section>
          <section className="itinerary-section">
            <h2>🏨 Stays</h2>
            <ul className="list checklist-list">
              {trip.stays?.map((s, i) => (
                <ChecklistItem id={`stay-${i}`} key={i} text={s.detail} price={s.price} />
              ))}
            </ul>
          </section>
          <section className="itinerary-section">
            <h2>📦 Packing List</h2>
            <ol className="list">
              {trip.packingList?.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ol>
          </section>
        </div>
      );
    }

    // --- Daily activity page ---
    const day = trip.days[activeDay - 1];

    return (
      <div className="daily-itinerary-detail">
        <div className="budget-summary-floating">Current Spent: ₹{formatted}</div>

        <h2>
          📅 {day.day} - {day.title}
        </h2>

        <ul className="list checklist-list">
          {day.activities?.map((act, i) => (
            <ChecklistItem
              id={`${day.day}-${i}`}
              key={i}
              text={act.name}
              price={act.price}
            />
          ))}
        </ul>

        {/* --- END TRIP BUTTON (ONLY ON LAST DAY) --- */}
        {activeDay === itineraryDays.length - 1 && (
          <div style={{ marginTop: "40px", textAlign: "center", paddingBottom: "50px" }}>
            <button
              className="end-trip-btn"
              onClick={() => setShowTripSuccess(true)} // SHOW success page inline
            >
              End Your Trip
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="home-container">
      {showTripSuccess ? (
        renderTripSuccess() // SHOW success page
      ) : (
        <main className="main-content">
          {id && (
            <button className="back-btn" onClick={() => navigate("/MyTrip")}>
              ← Back to My Trips
            </button>
          )}

          <div className="trip-header">
            <h1>{trip.title || trip.destinationName}</h1>
            <div className="trip-meta">
              <span>
                {trip.startDate} to {trip.endDate}
              </span>
              <span className="budget">Budget: ₹{trip.budget}</span>
            </div>
          </div>

          <div className="days-section">
            <div className="days-header">
              {itineraryDays.map((d, i) => (
                <div
                  key={i}
                  className={`day ${i === activeDay ? "active" : ""}`}
                  onClick={() => setActiveDay(i)}
                >
                  <span>{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {renderItineraryContent()}
        </main>
      )}
    </div>
  );
};

// --- Helper: Generate dynamic trip description ---
function generateDescription(destination) {
  const templates = [
    `From misty tea gardens to heritage streets, ${destination} gave us memories soaked in green, spice, and sunsets.`,
    `${destination} unfolded like a storybook — calm backwaters, busy lanes, and golden evenings.`,
    `We wandered through ${destination}, collecting flavors, views, and moments that stayed with us.`,
  ];
  const sum = destination.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  return templates[sum % templates.length];
}

export default Home;
