import React, { useState, useEffect } from "react";

const AuthorityDashboard = () => {
  const [outbreakData, setOutbreakData] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    fetch("http://127.0.0.1:8000/api/outbreak-summary/", {
      headers: { "Authorization": `Token ${token}` }
    })
      .then(res => res.json())
      .then(data => setOutbreakData(Array.isArray(data) ? data : []))
      .catch(() => setOutbreakData([]));

    fetch("http://127.0.0.1:8000/authority_dashboard_metrics/", {
      headers: { "Authorization": `Token ${token}` }
    })
      .then(res => res.json())
      .then(data => setMetrics(data))
      .catch(() => setMetrics(null))
      .finally(() => setLoading(false));
  }, []);

  const maxCount = outbreakData.length > 0 ? Math.max(...outbreakData.map(d => d.count || 0)) : 1;

  const getRiskLevel = (count) => {
    if (count >= 5) return { label: "🔴 Critical", color: "rgba(255,50,50,0.3)", border: "rgba(255,50,50,0.6)" };
    if (count >= 3) return { label: "🟠 High", color: "rgba(255,150,50,0.3)", border: "rgba(255,150,50,0.6)" };
    if (count >= 2) return { label: "🟡 Medium", color: "rgba(255,220,50,0.2)", border: "rgba(255,220,50,0.5)" };
    return { label: "🟢 Low", color: "rgba(50,200,50,0.2)", border: "rgba(50,200,50,0.5)" };
  };

  const getBarColor = (count) => {
    if (count >= 5) return "linear-gradient(135deg, #ff3232, #ff6b6b)";
    if (count >= 3) return "linear-gradient(135deg, #ff9632, #ffb347)";
    if (count >= 2) return "linear-gradient(135deg, #ffdc32, #ffe066)";
    return "linear-gradient(135deg, #32c832, #5dde5d)";
  };

  const sendAlert = (region, disease) => {
    const alert = {
      id: Date.now(),
      message: `🚨 Alert sent for ${disease} outbreak in ${region}`,
      time: new Date().toLocaleTimeString()
    };
    setAlerts(prev => [alert, ...prev]);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
      color: "white",
      fontFamily: "Segoe UI, sans-serif",
      padding: "40px"
    }}>
      <h1>Authority Dashboard 🏛️</h1>
      <p style={{ color: "rgba(255,255,255,0.5)" }}>Welcome, {localStorage.getItem("username")}</p>

      {/* Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginTop: "40px" }}>
        <div style={{
          background: "rgba(102,126,234,0.15)",
          border: "1px solid rgba(102,126,234,0.3)",
          borderRadius: "16px", padding: "24px", textAlign: "center"
        }}>
          <h2 style={{ fontSize: "40px", margin: 0 }}>{metrics?.total_migrants ?? "—"}</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginTop: "8px" }}>Total Migrants</p>
        </div>
        <div style={{
          background: "rgba(100,200,100,0.15)",
          border: "1px solid rgba(100,200,100,0.3)",
          borderRadius: "16px", padding: "24px", textAlign: "center"
        }}>
          <h2 style={{ fontSize: "40px", margin: 0 }}>{metrics?.eligible_count ?? "—"}</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginTop: "8px" }}>Eligible for Schemes</p>
        </div>
        <div style={{
          background: "rgba(255,100,100,0.15)",
          border: "1px solid rgba(255,100,100,0.3)",
          borderRadius: "16px", padding: "24px", textAlign: "center"
        }}>
          <h2 style={{ fontSize: "40px", margin: 0 }}>{metrics?.ai_alerts ?? "—"}</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", marginTop: "8px" }}>AI Alerts</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" }}>

        {/* Outbreak by Disease */}
        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "16px", padding: "24px"
        }}>
          <h3>🦠 Disease Outbreak Risk</h3>
          <div style={{ display: "flex", gap: "12px", marginBottom: "16px", fontSize: "12px" }}>
            <span>🔴 Critical (5+)</span>
            <span>🟠 High (3-4)</span>
            <span>🟡 Medium (2)</span>
            <span>🟢 Low (1)</span>
          </div>
          {loading ? (
            <p style={{ color: "rgba(255,255,255,0.5)" }}>Loading...</p>
          ) : outbreakData.length > 0 ? (
            outbreakData.map((item, i) => {
              const risk = getRiskLevel(item.count);
              return (
                <div key={i} style={{
                  background: risk.color,
                  border: `1px solid ${risk.border}`,
                  borderRadius: "8px",
                  padding: "12px",
                  marginBottom: "12px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontWeight: "600" }}>{item.recurring_diseases || "Unknown"}</span>
                    <span style={{ fontSize: "12px" }}>{risk.label} • {item.count} cases</span>
                  </div>
                  <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "4px", height: "8px" }}>
                    <div style={{
                      width: `${(item.count / maxCount) * 100}%`,
                      background: getBarColor(item.count),
                      borderRadius: "4px", height: "100%"
                    }} />
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ color: "rgba(255,255,255,0.5)" }}>No outbreak data.</p>
          )}
        </div>

        {/* Region Risk Map */}
        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "16px", padding: "24px"
        }}>
          <h3>📍 Region Risk Map</h3>
          {metrics?.region_data?.length > 0 ? (
            metrics.region_data.map((region, i) => {
              const risk = getRiskLevel(region.count);
              return (
                <div key={i} style={{
                  background: risk.color,
                  border: `1px solid ${risk.border}`,
                  borderRadius: "8px",
                  padding: "16px",
                  marginBottom: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: "600" }}>{region.location || "Unknown"}</p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
                      {region.count} migrant{region.count > 1 ? "s" : ""} • {risk.label}
                    </p>
                  </div>
                  <button
                    onClick={() => sendAlert(region.location, "outbreak")}
                    style={{
                      padding: "8px 14px",
                      background: "rgba(255,50,50,0.3)",
                      border: "1px solid rgba(255,50,50,0.5)",
                      borderRadius: "8px",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "600"
                    }}>
                    🚨 Send Alert
                  </button>
                </div>
              );
            })
          ) : (
            <p style={{ color: "rgba(255,255,255,0.5)" }}>No region data.</p>
          )}
        </div>
      </div>

      {/* Alert Log */}
      {alerts.length > 0 && (
        <div style={{
          background: "rgba(255,50,50,0.1)",
          border: "1px solid rgba(255,50,50,0.3)",
          borderRadius: "16px",
          padding: "24px",
          marginTop: "20px"
        }}>
          <h3>📢 Alert Log</h3>
          {alerts.map(alert => (
            <div key={alert.id} style={{
              background: "rgba(255,50,50,0.1)",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "8px",
              display: "flex",
              justifyContent: "space-between"
            }}>
              <span>{alert.message}</span>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>{alert.time}</span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default AuthorityDashboard;