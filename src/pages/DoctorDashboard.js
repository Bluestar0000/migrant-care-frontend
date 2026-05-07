import React, { useState } from "react";

const DoctorDashboard = () => {
  const [qrCode, setQrCode] = useState("");
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const lookupPatient = async () => {
    if (!qrCode.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://127.0.0.1:8000/api/qr-lookup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`
        },
        body: JSON.stringify({ value: qrCode })
      });
      if (!response.ok) throw new Error("Patient not found");
      const data = await response.json();
      setPatient(data);
    } catch (err) {
      setError("Patient not found. Check the QR code.");
      setPatient(null);
    }
    setLoading(false);
  };
  
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
      color: "white",
      fontFamily: "Segoe UI, sans-serif",
      padding: "40px"
    }}>
      <h1>Doctor Dashboard 👨‍⚕️</h1>
      <p style={{ color: "rgba(255,255,255,0.5)" }}>Welcome, {localStorage.getItem("username")}</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "40px" }}>

        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "16px",
          padding: "24px"
        }}>
          <h3>🔍 Lookup Patient by QR</h3>
          <input
            placeholder="Enter QR code or patient UUID..."
            value={qrCode}
            onChange={(e) => setQrCode(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.08)",
              color: "white",
              fontSize: "14px",
              boxSizing: "border-box"
            }}
          />
          <button
            onClick={lookupPatient}
            disabled={loading}
            style={{
              marginTop: "12px",
              padding: "10px 20px",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              border: "none",
              borderRadius: "8px",
              color: "white",
              cursor: "pointer",
              fontWeight: "600"
            }}>
            {loading ? "Searching..." : "Lookup Patient"}
          </button>
          {error && <p style={{ color: "#ff6b6b", marginTop: "12px" }}>{error}</p>}
        </div>

        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "16px",
          padding: "24px"
        }}>
          <h3>📊 Quick Stats</h3>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>Patients seen today: —</p>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>Pending records: —</p>
        </div>

        {patient && (
          <div style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(102,126,234,0.3)",
            borderRadius: "16px",
            padding: "24px",
            gridColumn: "1 / -1"
          }}>
            <h3>🧑‍⚕️ Patient Details</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
              {Object.entries(patient).map(([key, value]) => (
                value && typeof value !== "object" && (
                  <div key={key} style={{
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "8px",
                    padding: "12px"
                  }}>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", margin: "0 0 4px 0" }}>
                      {key.replace(/_/g, " ").toUpperCase()}
                    </p>
                    <p style={{ margin: 0, fontWeight: "600" }}>{String(value)}</p>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DoctorDashboard;