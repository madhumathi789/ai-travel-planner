
// import React, { useEffect, useState } from "react";
// import "./Profile.css";

// const isPasswordValid = (password) => {
//   return (
//     password.length >= 4 &&
//     /[A-Z]/.test(password) &&
//     /[a-z]/.test(password) &&
//     /[0-9]/.test(password) &&
//     /[@$!%*?&]/.test(password)
//   );
// };

// const Profile = () => {
//   const [user, setUser] = useState({
//     username: "",   // ← changed from name
//     email: "",
//     password: "",
//     newPassword: "",
//     confirmPassword: "",
//   });
// <p style={{ fontSize: "0.8rem", color: "#ddd" }}>
//   Password must contain uppercase, lowercase, number, special character (min 4)
// </p>

//   const [isEditing, setIsEditing] = useState(false);

//   // Fetch user profile
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const res = await fetch("http://localhost:5000/api/user/profile", {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });

//         if (!res.ok) throw new Error("Failed to fetch profile");
//         const data = await res.json();

//         setUser((prev) => ({
//           ...prev,
//           username: data.username || "",   // ← changed
//           email: data.email || "",
//         }));
//       } catch (err) {
//         console.error("Error fetching profile:", err);
//       }
//     };

//     fetchProfile();
//   }, []);

//   const handleEditToggle = () => {
//     setIsEditing(!isEditing);
//   };

//   const handleChange = (e) => {
//     setUser({ ...user, [e.target.name]: e.target.value });
//   };
//   if (user.newPassword) {
//   if (!isPasswordValid(user.newPassword)) {
//     alert(
//       "Password must be at least 4 characters and include uppercase, lowercase, number, and special character"
//     );
//     return;
//   }

//   if (user.newPassword !== user.confirmPassword) {
//     alert("New password and confirm password do not match");
//     return;
//   }
// }


//   const handleSave = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/api/user/profile", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({
//           username: user.username,   // ← changed
//           email: user.email,
//           password: user.password,
//           newPassword: user.newPassword,
//         }),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         alert(result.message || "Failed to update");
//         return;
//       }

//       alert("Profile updated successfully!");

//       // refresh UI
//       setUser({
//         username: result.user.username,  // ← changed
//         email: result.user.email,
//         password: "",
//         newPassword: "",
//         confirmPassword: "",
//       });

//       setIsEditing(false);
//     } catch (error) {
//       console.error("Error saving profile:", error);
//       alert("Error updating profile");
//     }
//   };

//   return (
//     <div className="profile-wrapper">
//       <div className="profile-card">
//         <div className="profile-avatar">
//           <img src="/L.png" alt="profile" />
//         </div>

//         <div className="profile-content">
//           <div className="profile-header">
//             <h2>Your Profile</h2>
//             <button className="edit-btn" onClick={handleEditToggle}>
//               {isEditing ? "Cancel" : "Edit"}
//             </button>
//           </div>

//           {/* Username */}
//           <div className="profile-field">
//             <label>Your Name :</label>
//             <input
//               type="text"
//               name="username"     // ← changed
//               value={user.username} // ← changed
//               readOnly={!isEditing}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Email */}
//           <div className="profile-field">
//             <label>Your Email :</label>
//             <input
//               type="email"
//               name="email"
//               value={user.email}
//               readOnly={!isEditing}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="profile-field">
//             <label>Your Password :</label>
//             <input
//               type="password"
//               name="password"
//               value={user.password}
//               readOnly={!isEditing}
//               onChange={handleChange}
//             />
//           </div>

//           {isEditing && (
//             <div className="profile-field">
//               <label>Current Password :</label>
//               <input
//                 type="password"
//                 name="password"
//                 value={user.password}
//                 onChange={handleChange}
//               />
//             </div>
//           )}

//           {isEditing && (
//             <div className="profile-field">
//               <label>New Password :</label>
//               <input
//                 type="password"
//                 name="newPassword"
//                 value={user.newPassword}
//                 onChange={handleChange}
//               />
//             </div>
//           )}

//           {isEditing && (
//             <div className="profile-field">
//               <label>Confirm Password :</label>
//               <input
//                 type="password"
//                 name="confirmPassword"
//                 value={user.confirmPassword}
//                 onChange={handleChange}
//               />
//             </div>
//           )}

//           {isEditing && (
//             <button className="save-btn" onClick={handleSave}>
//               Save Changes
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;


import React, { useEffect, useState } from "react";
import "./Profile.css";

const isPasswordValid = (password) => {
  if (!password) return false;
  return (
    password.length >= 4 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[@$!%*?&]/.test(password)
  );
};

const Profile = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user/profile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setUser((prev) => ({
          ...prev,
          username: data.username || "",
          email: data.email || "",
        }));
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    // ✅ Password validation ONLY on save
    if (user.newPassword) {
      if (!isPasswordValid(user.newPassword)) {
        alert(
          "Password must be at least 4 characters and include uppercase, lowercase, number, and special character"
        );
        return;
      }

      if (user.newPassword !== user.confirmPassword) {
        alert("New password and confirm password do not match");
        return;
      }
    }

    try {
      const response = await fetch("http://localhost:5000/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          username: user.username,
          email: user.email,
          password: user.password,
          newPassword: user.newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Failed to update");
        return;
      }

      alert("Profile updated successfully!");

      setUser({
        username: result.user.username,
        email: result.user.email,
        password: "",
        newPassword: "",
        confirmPassword: "",
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Error updating profile");
    }
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <div className="profile-avatar">
          <img src="/L.png" alt="profile" />
        </div>

        <div className="profile-content">
          <div className="profile-header">
            <h2>Your Profile</h2>
            <button className="edit-btn" onClick={handleEditToggle}>
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>

          {/* Username */}
          <div className="profile-field">
            <label>Your Name :</label>
            <input
              type="text"
              name="username"
              value={user.username}
              readOnly={!isEditing}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="profile-field">
            <label>Your Email :</label>
            <input
              type="email"
              name="email"
              value={user.email}
              readOnly={!isEditing}
              onChange={handleChange}
            />
          </div>

          {/* Current Password */}
          {isEditing && (
            <div className="profile-field">
              <label>Current Password :</label>
              <input
                type="password"
                name="password"
                value={user.password}
                onChange={handleChange}
              />
            </div>
          )}

          {/* New Password */}
          {isEditing && (
            <div className="profile-field">
              <label>New Password :</label>
              <input
                type="password"
                name="newPassword"
                value={user.newPassword}
                onChange={handleChange}
              />
              <p style={{ fontSize: "0.8rem", color: "#777" }}>
                Password must contain uppercase, lowercase, number, special
                character (min 4)
              </p>
            </div>
          )}

          {/* Confirm Password */}
          {isEditing && (
            <div className="profile-field">
              <label>Confirm Password :</label>
              <input
                type="password"
                name="confirmPassword"
                value={user.confirmPassword}
                onChange={handleChange}
              />
            </div>
          )}

          {isEditing && (
            <button className="save-btn" onClick={handleSave}>
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
