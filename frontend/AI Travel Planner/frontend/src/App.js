// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "./components/LoginPage.jsx";
// import RegisterPage from "./components/RegisterPage.jsx";
// import LandingPage from "./components/LandingPage.jsx";
// import TripDetails from "./components/tripdetails.jsx";
// import Preference from "./components/preference.jsx";
// import Home from "./components/Home.jsx";
// import Layout from "./components/Layout.js";
// import Memories from "./components/Memories.jsx";
// import Journal from "./components/Journal.jsx";
// import Budget from "./components/Budget.jsx";
// import Profile from "./components/Profile.jsx";
// import EditPreference from "./components/editpreference.jsx";
// import MyTrips from "./components/MyTrips.jsx"; 
// import ItineraryView from "./components/ItineraryView.jsx";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Landing Page is the default page */}
//         <Route path="/landing" element={<LandingPage />} />

//         {/* Login Page */}
//         <Route path="/" element={<Login />} />

//         {/* Register Page */}
//         <Route path="/register" element={<RegisterPage />} />
//         <Route path="/tripdetails" element={<TripDetails />} />
//         <Route path="/preference" element={<Preference />} />
//         <Route element={<Layout />}>
//           <Route path="home" element={<Home />} />
//           <Route path="home/:id" element={<Home />} />
//           <Route path="MyTrip" element={<MyTrips />} />
//           <Route path="/MyTrips/:id" element={<ItineraryView />} />
//           <Route path="memories" element={<Memories />} />
//           <Route path="journal" element={<Journal />} />
//           <Route path="budget" element={<Budget />} />
//           <Route path="profile" element={<Profile />} />
//           <Route path="editpreferences" element={<EditPreference />} />
//         </Route>
//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React from "react";
import"./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./components/LoginPage.jsx";
import RegisterPage from "./components/RegisterPage.jsx";
import LandingPage from "./components/LandingPage.jsx";
import TripDetails from "./components/tripdetails.jsx";
import Preference from "./components/preference.jsx";
import Home from "./components/Home.jsx";
import Layout from "./components/Layout.js";
import Memories from "./components/Memories.jsx";
import Journal from "./components/Journal.jsx";
import Budget from "./components/Budget.jsx";
import Profile from "./components/Profile.jsx";
import EditPreference from "./components/editpreference.jsx";
import MyTrips from "./components/MyTrips.jsx";
import ItineraryView from "./components/ItineraryView.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
// import TripSuccess from "./components/TripSuccess.jsx";
const LogoWrapper = ({ children }) => {
  const location = useLocation();

  // Routes where logo should appear
  const showLogoOn = ["/", "/landing", "/tripdetails", "/preference"];

  const shouldShowLogo = showLogoOn.some((p) =>
    location.pathname.startsWith(p)
  );

  return (
    <>
      {shouldShowLogo && (
        <div className="global-logo">
          <img src="/LOGO.jpg" alt="logo" className="logo-img" />
          <span className="logo-text">TravelZen AI</span>
        </div>
      )}
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      <LogoWrapper>
        <Routes>
          {/* Landing Page */}
          <Route path="/landing" element={<LandingPage />} />

          {/* Login Page */}
          <Route path="/" element={<Login />} />

          {/* Register Page */}
          <Route path="/register" element={<RegisterPage />} />
          
          {/* ForgotPassword */}
          <Route path="/forgot-password" element={<ForgotPassword />} />


          {/* Trip Details */}
          <Route path="/tripdetails" element={<TripDetails />} />

          {/* Preference Page */}
          <Route path="/preference" element={<Preference />} />
          {/* <Route path="/trip-success" element={<TripSuccess />} /> */}
          {/* All layout pages */}
          <Route element={<Layout />}>
            <Route path="home" element={<Home />} />
            <Route path="home/:id" element={<Home />} />
            <Route path="MyTrip" element={<MyTrips />} />
            <Route path="/MyTrips/:id" element={<ItineraryView />} />
            <Route path="memories" element={<Memories />} />
            <Route path="journal" element={<Journal />} />
            <Route path="budget" element={<Budget />} />
            <Route path="profile" element={<Profile />} />
            <Route path="editpreferences" element={<EditPreference />} />
          </Route>
        </Routes>
      </LogoWrapper>
    </Router>
  );
}

export default App;
