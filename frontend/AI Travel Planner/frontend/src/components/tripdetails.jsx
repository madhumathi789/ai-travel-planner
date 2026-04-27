import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "./TripDetails.css";

export default function TripDetails() {
  const [destinations, setDestinations] = useState([{ from: "", to: "" }]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [savePersonal, setSavePersonal] = useState(false);
  const [personalBudget, setPersonalBudget] = useState("");
  const navigate = useNavigate();

  const addDestination = () => {
    setDestinations((prev) => [...prev, { from: "", to: "" }]);
  };

  const handleChangeDestination = (index, field, value) => {
    const newDestinations = [...destinations];
    newDestinations[index][field] = value;
    setDestinations(newDestinations);
  };

  const handleNext = async () => {
    if (!budget) {
      alert("Please enter total budget.");
      return;
    }

    if (savePersonal && (!personalBudget || personalBudget > budget)) {
      alert("Enter a valid personal budget (less than total budget).");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // ✅ Get user token

      const response = await API.post(
        "/trips",
        {
          destinations,
          startDate,
          endDate,
          budget: Number(budget),
          personalBudget: savePersonal ? Number(personalBudget) : 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Attach token
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        navigate("/preference", {
          state: { tripDetails: response.data },
        });
      } else {
        alert("Failed to save trip details. Please try again.");
      }
    } catch (error) {
      console.error("Error saving trip:", error);
      alert("Error saving trip details. Please check the console.");
    }
  }; // ✅ Properly close handleNext here!

  return (
    <div className="trip-container">
      <div className="trip-card">
        <h2 className="trip-title">Trip Details</h2>

        <div className="mb-4">
          <label className="label">Destination</label>
          {destinations.map((dest, index) => (
            <div key={index} className={`form-row ${index > 0 ? "mt-2" : ""}`}>
              <input
                type="text"
                placeholder="From"
                className="input"
                value={dest.from}
                onChange={(e) =>
                  handleChangeDestination(index, "from", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="To"
                className="input"
                value={dest.to}
                onChange={(e) =>
                  handleChangeDestination(index, "to", e.target.value)
                }
              />
              {/* {index === destinations.length - 1 && (
                // <button className="add-btn" onClick={addDestination}>
                //   +
                // </button>
              )} */}
            </div>
          ))}
        </div>

        <div className="form-row mb-4">
          <div className="flex-1">
            <label className="label">Start Date</label>
            <input
              type="date"
              className="input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="label">End Date</label>
            <input
              type="date"
              className="input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="label">Budget</label>
          <div className="budget-row">
            <span className="currency">₹</span>
            <input
              type="number"
              placeholder="Enter amount"
              className="input input-right"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <label>
            <input
              type="checkbox"
              checked={savePersonal}
              onChange={(e) => setSavePersonal(e.target.checked)}
            />{" "}
            Save some amount for personal use
          </label>
          {savePersonal && (
            <div className="budget-row mt-2">
              <span className="currency">₹</span>
              <input
                type="number"
                placeholder="Enter personal budget"
                className="input input-right"
                value={personalBudget}
                onChange={(e) => setPersonalBudget(e.target.value)}
              />
            </div>
          )}
        </div>

        <button className="next-btn" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
}
