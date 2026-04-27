import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api"; // ✅ Import your axios instance
import "./login.css";
const isPasswordValid = (password) => {
  return (
    password.length >= 4 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[@$!%*?&]/.test(password)
  );
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ✅ Handle register with backend
  const handleRegister = async (e) => {
    e.preventDefault();
    
  if (!isPasswordValid(password)) {
    setError(
      "Password must be at least 4 characters and include uppercase, lowercase, number, and special character"
    );
    return;
  }
    try {
      const response = await API.post("/auth/register", {
        username: name,
        email,
        password,
      });
      if (response.status === 201) {
        //alert("Registered successfully!");
        navigate("/"); // redirect after success
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message || "Registration failed. Try again!"
      );
    }
  };

  return (
    <div className="login-container">
      {/* Left Section - Illustration */}
      <div className="left-section">
        <img
          src="/Frame_228.png" // Ensure this image is in the public folder
          alt="Register Illustration"
          className="illustration"
        />
      </div>

      {/* Right Section - Register Form */}
      <div className="right-section">
        <div className="form-container">
          <h2 className="form-title">Register</h2>

          <form onSubmit={handleRegister}>
            {/* Name Field */}
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                className="input-box"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email Field */}
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="input-box"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="input-box"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p style={{ fontSize: "0.8rem", color: "#ddd" }}>
                Password must contain uppercase, lowercase, number, special character (min 4)
              </p>
            </div>
            {/* Error Message */}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Register Button */}
            <button className="login-btn" type="submit">
              Register
            </button>

            {/* Navigate to Login */}
            <p className="register-text">
              Already have an account?{" "}
              <Link to="/" className="register-link">
                Login now
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
