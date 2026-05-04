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
  const [showTripSuccess, setShowTripSuccess] = useState(false);
  const [spentItems, setSpentItems] = useState(() => {
    const saved = localStorage.getItem("spentItems");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    if (!id) return;

    const fetchSaved = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/itineraries/${id}`);
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

  useEffect(() => {
    if (id) return;

    if (!tripDetails) {
      setLoading(false);
      return;
    }

    const generate = async () => {
      try {
        localStorage.setItem("spentItems", JSON.stringify({}));
        setSpentItems({});
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/generate-itinerary`, {
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

  useEffect(() => {
    if (id || tripDetails) return;

    const loadLast = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/itineraries`
        );
        const list = await res.json();
        if (list.length > 0) {
          setTrip(list[0]); 
        }
      } catch (err) {
        console.error("Failed loading last itinerary:", err);
      } finally {
        setLoading(false);
      }
    };

    loadLast();
  }, [id, tripDetails]);

  useEffect(() => {
    localStorage.setItem("spentItems", JSON.stringify(spentItems));
  }, [spentItems]);

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

  const itineraryDays = [
    { day: "Pre-Trip", date: trip.startDate, title: "Setup & Essential Booking" },
    ...(trip.days || []),
  ];

  return (
    <div className="home-container">
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

      </main>
    </div>
  );
};

export default Home;