import React, { useEffect, useState, useMemo } from "react";
import {
  MapPin,
  Calendar,
  Wallet,
  ArrowLeft,
  Clock,
  PieChart,
  CreditCard,
  RefreshCw,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import "./Budget.css";

const API_BASE_URL = "http://localhost:5000/api";

/* ------------------------- Helpers -------------------------- */
const parseAmount = (value) => {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;
  const cleaned = value.toString().replace(/[^0-9.]/g, "");
  return parseFloat(cleaned) || 0;
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const calculateDurationText = (start, end) => {
  if (!start || !end) return "N/A";
  const s = new Date(start);
  const e = new Date(end);
  if (isNaN(s) || isNaN(e)) return "N/A";
  const diffDays = Math.round((e - s) / (1000 * 60 * 60 * 24));
  return `${diffDays + 1} Days`;
};

/* ------------------------- Component ------------------------- */
const Budget = () => {
  const [tripList, setTripList] = useState([]);
  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDayIndex, setOpenDayIndex] = useState(null);
  const [debugInfo, setDebugInfo] = useState("");
  const [deleteStatus, setDeleteStatus] = useState(""); // For delete feedback

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    setListLoading(true);
    setError("");
    setDebugInfo("");
    setDeleteStatus("");

    try {
      const token = localStorage.getItem("token");
      console.log("🔍 Token check:", token ? "Present" : "Missing");

      if (!token) {
        setError("Please log in to view your trips.");
        setListLoading(false);
        return;
      }

      const endpoints = ["/trips", "/budget/my-trips", "/itineraries"];

      let trips = [];
      let successfulEndpoint = "";

      for (const endpoint of endpoints) {
        try {
          console.log(`Trying ${endpoint}...`);

          const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log(`✅ Success from ${endpoint}:`, data);

            if (Array.isArray(data)) trips = data;
            else if (data.data && Array.isArray(data.data)) trips = data.data;
            else if (data.trips && Array.isArray(data.trips)) trips = data.trips;

            if (trips.length > 0) {
              successfulEndpoint = endpoint;
              break;
            }
          }
        } catch (err) {
          console.log(`Endpoint ${endpoint} failed:`, err.message);
        }
      }

      if (trips.length === 0) {
        setDebugInfo("No trips found from any endpoint");
      } else {
        setDebugInfo(`Found ${trips.length} trips from ${successfulEndpoint}`);

        const formattedTrips = trips.map((trip) => {
  const itineraryId = trip.itineraryId || trip._id;

  return {
    _id: trip._id,
    title: `${trip.destinations?.[0]?.from?.toUpperCase()} to ${trip.destinations?.[0]?.to?.toUpperCase()}`,

 // ✅ using itineraryId instead of trip.title
    destinations: Array.isArray(trip.destinations)
      ? trip.destinations.map((d) => `${d.from} → ${d.to}`)
      : [trip.destinations || "Unknown"],
    startDate: trip.startDate,
    endDate: trip.endDate,
    budget: trip.budget || trip.totalBudget || 0,
    itineraryId,
    source: successfulEndpoint,
  };
});

        setTripList(formattedTrips);
      }
    } catch (err) {
      console.error("❌ Failed to load trips:", err);
      setError(err.message || "Failed to load trips");
    } finally {
      setListLoading(false);
    }
  };

  const handleDeleteTrip = async (tripId, e) => {
    e.stopPropagation();
    
    // NO ALERT - Direct delete
    console.log("🗑 Deleting trip:", tripId);
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/trips/${tripId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        // Remove from local state
        setTripList(tripList.filter(trip => trip._id !== tripId));
        setDeleteStatus("Trip deleted successfully!");
        
        // Clear status after 2 seconds
        setTimeout(() => setDeleteStatus(""), 2000);
      } else {
        console.error("Failed to delete trip");
        setDeleteStatus("Failed to delete trip");
        setTimeout(() => setDeleteStatus(""), 2000);
      }
    } catch (err) {
      console.error("Delete error:", err);
      setDeleteStatus("Error deleting trip");
      setTimeout(() => setDeleteStatus(""), 2000);
    }
  };

  const fetchItineraryDetails = async (trip) => {
    console.log("Fetching details for:", trip);

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please log in first");

      const itineraryId = trip.itineraryId || trip._id;

      const endpoints = [
        `/itineraries/${itineraryId}`,
        `/budget/${itineraryId}`,
        `/trips/${trip._id}`,
      ];

      let itineraryData = null;

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            itineraryData = await response.json();
            console.log(`✅ Got data from ${endpoint}`);
            
            // Debug daywise data
            console.log("📅 Daywise data:", itineraryData.days);
            console.log("📊 Days is array:", Array.isArray(itineraryData.days));
            console.log("🔢 Days count:", itineraryData.days?.length || 0);
            
            break;
          }
        } catch (err) {
          console.log(`Endpoint ${endpoint} failed:`, err.message);
        }
      }

      if (!itineraryData) {
        itineraryData = {
          title: trip.title,
          startDate: trip.startDate,
          endDate: trip.endDate,
          budget: trip.budget,
          destinations: trip.destinations,
          days: [],
        };
        console.log("⚠ Using basic trip data");
      }

      // Ensure days is always an array
      if (!Array.isArray(itineraryData.days)) {
        console.log("⚠ Days is not array, converting...");
        itineraryData.days = [];
      }

      setSelectedItinerary(itineraryData);
      setOpenDayIndex(0);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("❌ Failed to load details:", err);
      setError(err.message || "Failed to load trip details");
    } finally {
      setLoading(false);
    }
  };

  const finances = useMemo(() => {
    if (!selectedItinerary) return null;

    const totalBudget = parseAmount(selectedItinerary.budget || 0);
    let used = 0;

    if (selectedItinerary.transport?.price)
      used += parseAmount(selectedItinerary.transport.price);

    if (Array.isArray(selectedItinerary.stays))
      selectedItinerary.stays.forEach((s) => {
        used += parseAmount(s.price);
      });

    if (Array.isArray(selectedItinerary.days))
      selectedItinerary.days.forEach((d) => {
        if (Array.isArray(d.activities))
          d.activities.forEach((a) => {
            used += parseAmount(a.price || a.cost || 0);
          });
      });

    const balance = totalBudget - used;
    const usedPct = totalBudget > 0 ? (used / totalBudget) * 100 : 0;

    return { totalBudget, used, balance, usedPct };
  }, [selectedItinerary]);

  /* ---------------------- UI ---------------------- */

  if (listLoading) {
    return (
      <div className="budget-container">
        <div className="loading-spinner">Loading trips...</div>
      </div>
    );
  }

  if (!selectedItinerary) {
    return (
      <div className="budget-container">
        <header className="budget-header">
          <h1>
            <PieChart /> My Budgets
          </h1>
          <p>Select a trip to view the financial breakdown.</p>

          {debugInfo && <div className="debug-info"><small>{debugInfo}</small></div>}
          {deleteStatus && <div className="success-message">{deleteStatus}</div>}

          <button className="refresh-btn" onClick={loadTrips}>
            <RefreshCw size={16} /> Refresh
          </button>
        </header>

        {error && <div className="error-alert">{error}</div>}

        {tripList.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Wallet size={48} color="#4f46e5" />
            </div>
            <h3>No Trips Found</h3>
            <p>Create a trip first from the homepage.</p>
          </div>
        ) : (
          <div className="trips-grid">
            {tripList.map((trip, index) => (
              <div
                key={trip._id}
                className="polaroid-card"
                style={{
                  backgroundImage: `url(${process.env.PUBLIC_URL}/budget1.jpg)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  position: "relative",
                }}
              >
                {/* Dark overlay for better text readability */}
                <div 
                  className="image-overlay"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7))",
                    zIndex: 1,
                  }}
                ></div>
                
                {/* Content on top of image */}
                <div className="polaroids-contents" style={{ position: "relative", zIndex: 2 }}>
                  <h3 style={{ color: "#000000" }}>{trip.title}</h3>
                  <div className="trips-info" style={{ color: "#000000" }}>{trip.destinations?.join(", ")}</div>
                  <div className="trips-dates" style={{ color: "#000000" }}>
                    {trip.startDate?.slice(0, 10) || "TBD"} - {trip.endDate?.slice(0, 10) || "TBD"}
                  </div>
                  <div className="trips-budget" style={{ color: "rgba(0, 121, 107, 0.9)", fontSize: "1.2rem, font-style: bold" }}>
                    {formatCurrency(trip.budget)}
                  </div>
                  
                  {/* View/Delete Buttons */}
                  <div className="card-buttons-container">
                    <button 
                      className="view-btn" 
                      onClick={() => fetchItineraryDetails(trip)}
                      style={{ 
                        backgroundColor: "rgba(0, 121, 107, 0.9)",
                        border: "1px solid rgba(255,255,255,0.3)"
                      }}
                    >
                     👁 View
                    </button>
                    <button 
                      className="delete-btn" 
                      onClick={(e) => handleDeleteTrip(trip._id, e)}
                      style={{ 
                        backgroundColor: "rgba(229, 57, 53, 0.9)",
                        border: "1px solid rgba(255,255,255,0.3)"
                      }}
                    >
                     🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ===================== DETAILED ITINERARY SCREEN ===================== */

  return (
    <div className="budget-detail-container">
      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">Loading itinerary details...</div>
        </div>
      )}

      <div className="detail-header">
        <button className="back-btn" onClick={() => setSelectedItinerary(null)}>
          <ArrowLeft /> Back
        </button>
        <h2>{selectedItinerary.title || "Trip Budget"}</h2>
      </div>

      <div className="info-cards">
        <div className="info-card">
          <div className="info-icon">
            <MapPin color="#4338ca" />
          </div>
          <div>
            <div className="info-label">Destination</div>
            <div className="info-value">
              {selectedItinerary.destinations?.[0] || "Unknown"}
            </div>
          </div>
        </div>

        <div className="info-card">
          <div className="info-icon">
            <Calendar color="#059669" />
          </div>
          <div>
            <div className="info-label">Duration</div>
            <div className="info-value">
              {calculateDurationText(
                selectedItinerary.startDate,
                selectedItinerary.endDate
              )}
            </div>
          </div>
        </div>

        <div className="info-card">
          <div className="info-icon">
            <Clock color="#ea580c" />
          </div>
          <div>
            <div className="info-label">Travel Dates</div>
            <div className="info-value">
              {new Date(selectedItinerary.startDate).toLocaleDateString(
                "en-US",
                { month: "short", day: "numeric" }
              )}{" "}
              -{" "}
              {new Date(selectedItinerary.endDate).toLocaleDateString(
                "en-US",
                { month: "short", day: "numeric", year: "numeric" }
              )}
            </div>
          </div>
        </div>

        <div className="info-card">
          <div className="info-icon">
            <Wallet color="#7c3aed" />
          </div>
          <div>
            <div className="info-label">Budget</div>
            <div className="info-value">
              {formatCurrency(finances?.totalBudget)}
            </div>
          </div>
        </div>
      </div>

      <div className="budget-timeline">
        <div className="budget-summary">
          <div>
            <div className="budget-label">Balance Budget</div>
            <div className="budget-amount balance">
              {formatCurrency(finances?.balance)}
            </div>
          </div>

          <div>
            <div className="budget-label">Used Budget</div>
            <div className="budget-amount used">
              {formatCurrency(finances?.used)}
            </div>
          </div>
        </div>

        <div className="progress-bar">
          <div
            className="progress-balance"
            style={{
              width: `${Math.max(
                0,
                Math.min(
                  100,
                  finances ? 100 - finances.usedPct : 100
                )
              )}%`,
            }}
          >
            {formatCurrency(finances?.balance)}
          </div>

          <div
            className="progress-used"
            style={{
              width: `${Math.max(
                0,
                Math.min(100, finances ? finances.usedPct : 0)
              )}%`,
            }}
          >
            {formatCurrency(finances?.used)}
          </div>
        </div>
      </div>
      
      {/* DAY-WISE HISTORY SECTION */}
      <div className="daily-breakdown">
        <h3>Daily Budget Breakdown</h3>

        <div className="days-list">
          {selectedItinerary.days && Array.isArray(selectedItinerary.days) && selectedItinerary.days.length > 0 ? (
            selectedItinerary.days.map((day, idx) => {
              const dayTotal = day.activities && Array.isArray(day.activities)
                ? day.activities.reduce(
                    (sum, a) => sum + parseAmount(a?.price || a?.cost || 0),
                    0
                  )
                : 0;

              return (
                <div key={idx} className="day-card">
                  <button
                    className="day-header"
                    onClick={() =>
                      setOpenDayIndex(openDayIndex === idx ? null : idx)
                    }
                  >
                    <div className="day-info">
                      <div className="day-title">
                        Day {day.day || idx + 1} — {day.title || "Untitled Day"}
                      </div>
                      <div className="day-date">
                        {day.date ? new Date(day.date).toLocaleDateString() : "Date not set"}
                      </div>
                    </div>

                    <div className="day-total">
                      <div className="day-amount">
                        {formatCurrency(dayTotal)}
                      </div>
                      <div className="day-toggle">
                        {openDayIndex === idx ? (
                          <ChevronUp size={16} /> 
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </div>
                    </div>
                  </button>

                  {openDayIndex === idx && (
                    <div className="day-activities">
                      {day.activities && Array.isArray(day.activities) && day.activities.length > 0 ? (
                        day.activities.map((act, i) => (
                          <div key={i} className="activity-card">
                            <div className="activity-info">
                              <div className="activity-icon">
                                <CreditCard color="#0ea5a4" />
                              </div>
                              <div>
                                <div className="activity-name">
                                  {act?.name || act?.placeName || "Unnamed Activity"}
                                </div>
                                {act?.detail && (
                                  <div className="activity-detail">
                                    {act.detail}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="activity-cost">
                              <div className="activity-price">
                                {formatCurrency(
                                  parseAmount(act?.price || act?.cost || 0)
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="no-activities">
                          No activities scheduled for this day.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="no-days">
              <p>No day-by-day itinerary available for this trip.</p>
              <p className="debug-info">
                {selectedItinerary.days 
                  ? "Days data exists but is not in expected format" 
                  : "No days data found in itinerary"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Budget;