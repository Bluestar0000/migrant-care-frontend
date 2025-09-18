import React, { useEffect, useState } from "react";
type Vital = {
  temperature: number;
  blood_pressure: string;
  heart_rate: number;
  timestamp?: string;
};

export default function AuthoritiesDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [uuid, setUuid] = useState("");
  const [vitals, setVitals] = useState<Vital[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    fetch("http://127.0.0.1:8000/api/authority_dashboard_metrics/", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => setMetrics(data))
      .catch((err) => console.error("Metrics fetch failed", err));
  }, []);

  const handleFetchVitals = () => {
    const token = localStorage.getItem("authToken");

    fetch(`http://127.0.0.1:8000/api/get_patient_vitals/${uuid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Vitals response:", data);
        // ✅ Use data.vitals if available, else fallback to data
        setVitals(data.vitals ?? data);
      })
      .catch((err) => console.error("Vitals fetch failed", err));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-indigo-700">Authorities Dashboard</h1>

      {metrics ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Total Migrants</h2>
            <p className="text-3xl text-indigo-600">{metrics.total_migrants}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">Eligible for Schemes</h2>
            <p className="text-3xl text-green-600">{metrics.eligible_count}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">AI Alerts Issued</h2>
            <p className="text-3xl text-red-600">{metrics.ai_alerts}</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Loading metrics...</p>
      )}

      {/* 🔹 Vitals Fetch Section */}
      <div className="mt-6">
        <input
          type="text"
          placeholder="Enter QR UUID"
          value={uuid}
          onChange={(e) => setUuid(e.target.value)}
          className="input input-bordered"
        />
        <button onClick={handleFetchVitals} className="btn btn-primary ml-2">
          Fetch Vitals
        </button>

        {vitals.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Vitals</h3>
            {vitals.map((v, i) => (
              <p key={i}>
                Temp: {v.temperature ?? "N/A"}°C | BP: {v.blood_pressure ?? "N/A"} | HR: {v.heart_rate ?? "N/A"}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}