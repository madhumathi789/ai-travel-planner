import React from "react";
import { useNavigate } from "react-router-dom";
import "./landing.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <button
        className="landing-button"
        onClick={() => navigate("/tripdetails")}
      >
        Plan Your Trip Now
      </button>
    </div>
  );
};

export default LandingPage;