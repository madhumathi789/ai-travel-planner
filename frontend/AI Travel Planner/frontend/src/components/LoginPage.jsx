// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "./login.css";
// import API from "../api"; // ✅ Axios instance pointing to backend (see below for api.js)

// const Login = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!email || !password) {
//       setError("Please enter email and password");
//       return;
//     }

//     try {
//       // ✅ API call to backend
//       const response = await API.post("/auth/login", { email, password });

//       // Assuming backend sends: { token, user }
//       const { token, user } = response.data;

//       // ✅ Save to localStorage for session persistence
//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));

//       // ✅ Redirect to landing page
//       navigate("/landing");
//     } catch (err) {
//       console.error("Login error:", err);
//       const message =
//         err.response?.data?.message || "Invalid email or password!";
//       setError(message);
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="left-section">
//         {/* SAME LOGO YOU USE IN SIDEBAR
//         <div className="logo login-page-logo">
//           <img src="/LOGO.jpg" alt="logo" className="logo-img" />
//           <span className="logo-text">TravelZen AI</span>
//         </div> */}

//         <img
//           src="/Frame_227.png"
//           alt="Travel Illustration"
//           className="illustration"
//         />
//       </div>

//       <div className="right-section">
//         <div className="form-container">
//           <h2 className="form-title">Login</h2>

//           <form onSubmit={handleLogin}>
//             <div className="input-group">
//               <label htmlFor="email">Email</label>
//               <input
//                 id="email"
//                 type="email"
//                 placeholder="Enter your email"
//                 className="input-box"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>

//             <div className="input-group">
//               <label htmlFor="password">Password</label>
//               <input
//                 id="password"
//                 type="password"
//                 placeholder="Enter your password"
//                 className="input-box"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />

//               <div className="forgot-link">
//                 <button
//                   type="button"
//                   className="forgot-btn"
//                   onClick={(e) => navigate("/forgot-password")}
//                 >
//                   Forget Password?
//                 </button>
//               </div>
//             </div>

//             {error && (
//               <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>
//             )}

//             <button className="login-btn" type="submit">
//               Login
//             </button>

//             <p className="register-text">
//               Don’t have an account?{" "}
//               <Link to="/register" className="register-link">
//                 Register now
//               </Link>
//             </p>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import API from "../api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      const response = await API.post("/auth/login", { email, password });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/landing");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password!");
    }
  };

  return (
    <div className="login-container">
      {/* LEFT IMAGE SECTION */}
      <div className="left-section">
        <img
          src="/Frame_227.png"
          alt="Travel Illustration"
          className="illustration"
        />
      </div>

      {/* RIGHT FORM SECTION */}
      <div className="right-section">
        <div className="form-container">
          <h2 className="form-title">Login</h2>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
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
                placeholder="Enter your password"
                className="input-box"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="forgot-link">
              <button
                type="button"
                className="forgot-btn"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </button>
            </div>

            {error && <p className="error-text">{error}</p>}

            <button className="login-btn" type="submit">
              Login
            </button>

            <p className="register-text">
              Don’t have an account?{" "}
              <Link to="/register" className="register-link">
                Register now
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
