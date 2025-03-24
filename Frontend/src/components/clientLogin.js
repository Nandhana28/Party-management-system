import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ClientLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

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
        alert("Login successful!");
        navigate("/dashboard"); // Redirect to dashboard
      } else {
        setError(data.message || "Invalid username or password.");
      }
    } catch (error) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Client Login</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button}>Login</button>
      </form>
      <p style={styles.link} onClick={() => navigate("/register")}>
        Don't have an account? Register
      </p>
    </div>
  );
};

// Inline styles
const styles = {
  container: { textAlign: "center", padding: "50px", maxWidth: "400px", margin: "auto" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  input: { padding: "10px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "5px" },
  button: { padding: "10px", fontSize: "16px", background: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" },
  link: { marginTop: "10px", color: "#007bff", cursor: "pointer" },
  error: { color: "red" }
};

export default ClientLogin;
