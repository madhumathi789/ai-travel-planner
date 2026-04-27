import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
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


const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (!isPasswordValid(password)) {
  setError(
    "Password must be at least 4 characters and include uppercase, lowercase, number, and special character"
  );
  return;
}

if (password !== confirmPassword) {
  setError("Passwords do not match");
  return;
}

    try {
      await API.post("/auth/reset-password-direct", {
        email,
        password,
      });
    //   t("Password reset successful");aler
      navigate("/"); // back to login
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="login-container">
      <div className="left-section">
        <img
          src="/Frame_227.png"
          alt="Illustration"
          className="illustration"
        />
      </div>

      <div className="right-section">
        <div className="form-container">
          <h2 className="form-title">Reset Password</h2>

          <form onSubmit={handleReset}>
            <div className="input-group">
              <label>Email</label>
              <input
                className="input-box"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>New Password</label>
              <input
                className="input-box"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            <p style={{ fontSize: "0.8rem", color: "#ddd" }}>
                Password must contain uppercase, lowercase, number, special character (min 4)
             </p>
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <input
                className="input-box"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button className="login-btn">Save</button>

            <p
              className="register-text"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              Back to Login
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
