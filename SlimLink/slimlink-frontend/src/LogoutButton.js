import React from "react";
import { auth } from "./Pages/firebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
      navigate("/login"); // Redirect to login page after logout
    } catch (err) {
      console.error("Logout error:", err.message);
    }
  };

  return (
    <button onClick={handleLogout} style={{
      padding: "10px",
      backgroundColor: "#FF5252",
      color: "#fff",
      border: "none",
      cursor: "pointer"
    }}>
      Logout
    </button>
  );
};

export default LogoutButton;
