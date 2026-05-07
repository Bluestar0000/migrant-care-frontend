import React, { useState, useEffect } from "react";

const PatientDashboard = () => {
  const [symptoms, setSymptoms] = useState("");
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/api/my-profile/", {
        headers: { "Authorization": `Token ${token}` }
      });
      const data = await res.json();
      setProfile(data);
    };
    fetchProfile();
  }, []);

  const getRecommendations = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/ai-recommendations/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`
        },
        body: JSON.stringify({ symptoms })
      });
      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (err) {
      setRecommendations([]);
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
      <h1>Welcome, {profile?.name || localStorage.getItem("username")} 👋</h1>
      <p style={{ color: "rgba(255,255,255,0.5)" }}>Patient Dashboard • {profile?.location}</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "40px" }}>

        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "16px",
          padding: "24px",
          textAlign: "center"
        }}>
          <h3>📱 My Health QR</h3>
          {profile?.qr_code_url ? (
            <>
              <img src={profile.qr_code_url} alt="Patient QR"
                style={{ width: "180px", borderRadius: "8px", background: "white", padding: "8px" }} />
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginTop: "8px" }}>
                Show this to your doctor
              </p>
              <div style={{ marginTop: "12px", fontSize: "13px" }}>
                <span style={{ background: "rgba(255,0,0,0.2)", padding: "4px 10px", borderRadius: "20px", marginRight: "8px" }}>
                  🩸 {profile.blood_group}
                </span>
                <span style={{ background: "rgba(100,100,255,0.2)", padding: "4px 10px", borderRadius: "20px" }}>
                  🗣️ {profile.language}
                </span>
              </div>
              {profile?.emergency_contact_name && (
                <div style={{
                  marginTop: "12px",
                  background: "rgba(255,100,100,0.1)",
                  border: "1px solid rgba(255,100,100,0.2)",
                  borderRadius: "8px",
                  padding: "10px",
                  fontSize: "13px",
                  textAlign: "left"
                }}>
                  <p style={{ margin: "0 0 4px 0" }}>🚨 Emergency Contact</p>
                  <p style={{ margin: 0, fontWeight: "600" }}>{profile.emergency_contact_name} ({profile.emergency_contact_relation})</p>
                  <p style={{ margin: 0, color: "rgba(255,255,255,0.6)" }}>📞 {profile.emergency_contact_phone}</p>
                </div>
              )}
            </>
          ) : (
            <p style={{ color: "rgba(255,255,255,0.5)" }}>Loading QR...</p>
          )}
        </div>

        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "16px",
          padding: "24px"
        }}>
          <h3>🩺 My Symptoms</h3>
          <textarea
            placeholder="Describe your symptoms..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            style={{
              width: "100%",
              height: "100px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "8px",
              color: "white",
              padding: "12px",
              fontSize: "14px",
              boxSizing: "border-box"
            }}
          />
          <button onClick={getRecommendations} disabled={loading} style={{
            marginTop: "12px",
            padding: "10px 20px",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            border: "none",
            borderRadius: "8px",
            color: "white",
            cursor: "pointer",
            fontWeight: "600"
          }}>
            {loading ? "Analyzing..." : "Get AI Recommendations"}
          </button>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "16px",
          padding: "24px"
        }}>
          <h3>👤 My Profile</h3>
          {profile ? (
            <div style={{ fontSize: "14px", lineHeight: "2" }}>
              <p>🆔 Migrant ID: <strong>{profile.migrant_id}</strong></p>
              <p>🎂 Age: <strong>{profile.age}</strong></p>
              <p>⚧ Gender: <strong>{profile.gender}</strong></p>
              <p>📍 Location: <strong>{profile.location}</strong></p>
              <p>🏥 Hospital: <strong>{profile.home_hospital_name}</strong></p>
            </div>
          ) : (
            <p style={{ color: "rgba(255,255,255,0.5)" }}>Loading profile...</p>
          )}
        </div>

        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "16px",
          padding: "24px"
        }}>
          <h3>📋 My Medical Records</h3>
          <p style={{ color: "rgba(255,255,255,0.5)" }}>No records found yet.</p>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "16px",
          padding: "24px",
          gridColumn: "1 / -1"
        }}>
          <h3>💊 AI Recommendations</h3>
          {recommendations && recommendations.length > 0 ? (
            recommendations.map((rec, i) => (
              <div key={i} style={{
                background: "rgba(102,126,234,0.1)",
                border: "1px solid rgba(102,126,234,0.3)",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "12px"
              }}>
                <h4 style={{ margin: "0 0 8px 0" }}>{rec.title}</h4>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.7)", fontSize: "14px" }}>{rec.description}</p>
              </div>
            ))
          ) : (
            <p style={{ color: "rgba(255,255,255,0.5)" }}>Submit symptoms to get recommendations.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default PatientDashboard;