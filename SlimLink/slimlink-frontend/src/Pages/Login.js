import React, { useState } from "react";
import { auth, googleProvider } from "./firebaseConfig";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // To handle navigation

  // Handle email/password login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in successfully!");
      navigate("/"); // Redirect to home page after login
    } catch (err) {
      setError("Failed to log in. Please check your credentials.");
      console.error("Login error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign-In
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      alert("Logged in with Google successfully!");
      navigate("/"); // Redirect to home page after Google login
    } catch (err) {
      setError("Failed to log in with Google. Please try again.");
      console.error("Google Sign-In error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "2rem" }}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", margin: "8px 0" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", margin: "8px 0" }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#6200EE",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p style={{ textAlign: "center", marginTop: "1rem" }}>or</p>
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#4285F4",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          marginTop: "1rem",
        }}
      >
        {loading ? "Logging in with Google..." : "Login with Google"}
      </button>
      <p style={{ textAlign: "center", marginTop: "1rem" }}>
        Don’t have an account?{" "}
        <Link to="/create-account" style={{ color: "#6200EE", textDecoration: "none" }}>
          Create one here
        </Link>
      </p>
    </div>
  );
};

export default Login;
