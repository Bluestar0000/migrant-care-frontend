import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/lookup";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(username, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", data.username);

      if (data.role === "doctor") navigate("/doctor-dashboard");
      else if (data.role === "patient") navigate("/patient-dashboard");
      
      else if (data.role === "authority") navigate("/outbreak");
    } catch (err) {
      setError("Invalid credentials");
    }
  };
  

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Segoe UI, sans-serif"
    }}>
      <div style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "16px",
        padding: "48px",
        width: "380px",
        boxShadow: "0 25px 50px rgba(0,0,0,0.4)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "40px", marginBottom: "8px" }}>🏥</div>
          <h2 style={{ color: "white", fontSize: "24px", fontWeight: "700", margin: 0 }}>
            MigrantCare
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginTop: "8px", fontSize: "14px" }}>
            Healthcare for all communities
          </p>
        </div>

        {error && (
          <div style={{
            background: "rgba(255,80,80,0.15)",
            border: "1px solid rgba(255,80,80,0.3)",
            color: "#ff6b6b",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px",
            fontSize: "14px"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <input
            style={{
              width: "100%",
              padding: "14px 16px",
              marginBottom: "16px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.08)",
              color: "white",
              fontSize: "15px",
              outline: "none",
              boxSizing: "border-box"
            }}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            style={{
              width: "100%",
              padding: "14px 16px",
              marginBottom: "24px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.08)",
              color: "white",
              fontSize: "15px",
              outline: "none",
              boxSizing: "border-box"
            }}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "8px",
              border: "none",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              color: "white",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              letterSpacing: "0.5px"
            }}
          >
            Login
          </button>
        </form>

        <p style={{
          textAlign: "center",
          color: "rgba(255,255,255,0.3)",
          fontSize: "12px",
          marginTop: "24px"
        }}>
          Secured by HealChain • HealthBridge Platform
        </p>
      </div>
    </div>
  );
};

export default LoginPage;