import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import "./login.css";
import bg from "../assets/background.jpg";

const isPasswordValid = (password) => {
  return (
    password.length >= 6 &&
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

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!isPasswordValid(password)) {
      setError(
        "Password must include uppercase, lowercase, number, and special character (min 6)"
      );
      return;
    }

    try {
      const res = await API.post("/auth/register", {
        username: name,
        email,
        password,
      });

      if (res.status === 201) {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* LEFT */}
      <div className="left-section">
        <img src="/Frame_228.png" alt="Register" className="illustration" />
      </div>

      {/* RIGHT */}
      <div className="right-section">
        <div className="form-container">
          <h2 className="form-title">Create Account</h2>

          <form onSubmit={handleRegister}>
            <div className="input-group">
              <label>Name</label>
              <input
                type="text"
                className="input-box"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                className="input-box"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                className="input-box"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p style={{ fontSize: "0.8rem", color: "#ddd" }}>
                Must include uppercase, lowercase, number & special character
              </p>
            </div>

            {error && <p className="error-text">{error}</p>}

            <button className="login-btn">Register</button>

            <p className="register-text">
              Already have an account? <Link to="/">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;