import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/clientLogin.css"; // Include CSS

const ClientLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous error

    try {
      const response = await fetch("http://localhost:5000/Clientlogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user)); // Store user details
        alert("Login successful!");
        navigate("/bookings"); // Redirect to Bookings page
      } else {
        setError(data.message || "Invalid username or password.");
      }
    } catch (error) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="card-container">
          <div className="left-card">
            <h4>Experience Excellence, Every Time!</h4>
            <p>Log in to manage your bookings — our commitment to quality never wavers.</p>
          </div>
          <div className="right-card">
            <h2>Client Login</h2>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p className="error">{error}</p>}
              <button type="submit">Login</button>
            </form>
            <p className="register-link" onClick={() => navigate("/register")}>
              Don't have an account? Register
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientLogin;
