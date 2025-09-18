import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

// 🔹 Chart.js imports
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

// 🔹 Register chart components
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function DoctorDashboard() {
  const [qrUUID, setQrUUID] = useState("");
  const [patientData, setPatientData] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [vitals, setVitals] = useState<any[]>([]);

  const fetchPatient = (uuid: string) => {
    const token = localStorage.getItem("authToken");

    fetch(`http://127.0.0.1:8000/api/get_full_patient_info_by_qr/${uuid}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((json) => setPatientData(json))
      .catch((err) => console.error("QR fetch failed", err));

    fetch(`http://127.0.0.1:8000/api/get_patient_vitals/${uuid}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => setVitals(data))
      .catch((err) => console.error("Vitals fetch failed", err));
  };

  const handleSearch = () => {
    if (qrUUID) fetchPatient(qrUUID);
  };

  const handleUpdate = () => {
    const token = localStorage.getItem("authToken");
    const recordId = patientData.medical_records[0].id;

    fetch(`http://127.0.0.1:8000/api/medical-records/${recordId}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ diagnosis })
    })
      .then((res) => res.json())
      .then((updated) => {
        const newData = { ...patientData };
        newData.medical_records[0] = updated;
        setPatientData(newData);
        setEditing(false);
      })
      .catch((err) => console.error("Update failed", err));
  };

  useEffect(() => {
    if (patientData?.medical_records[0]) {
      setDiagnosis(patientData.medical_records[0].diagnosis || "");
    }
  }, [patientData]);

  // 🔹 QR Scanner setup
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 }, false);

    scanner.render(
      (decodedText) => {
        setQrUUID(decodedText);
        fetchPatient(decodedText);
      },
      (error) => {
        console.warn("QR scan error", error);
      }
    );

    return () => {
      scanner.clear().catch((err) => {
        console.warn("Failed to clear scanner", err);
      });
    };
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-indigo-700">Doctor Dashboard</h1>

      {/* 🔹 QR Scanner */}
      <div id="qr-reader" className="max-w-md" />

      {/* 🔹 Manual UUID Input */}
      <div className="flex gap-4 items-center mt-4">
        <input
          type="text"
          value={qrUUID}
          onChange={(e) => setQrUUID(e.target.value)}
          placeholder="Enter QR UUID"
          className="border p-2 rounded w-64"
        />
        <button
          onClick={handleSearch}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Fetch Patient
        </button>
      </div>

      {/* 🔹 Patient Info */}
      {patientData && (
        <div className="bg-white p-4 rounded shadow space-y-4">
          <h2 className="text-lg font-semibold">Patient: {patientData.profile.name}</h2>
          <p>Age: {patientData.profile.age}</p>
          <p>Gender: {patientData.profile.gender}</p>

          {/* 🔹 Editable Diagnosis */}
          {editing ? (
            <div className="space-y-2">
              <textarea
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="border p-2 w-full rounded"
              />
              <button
                onClick={handleUpdate}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save Diagnosis
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <p>Diagnosis: {diagnosis || "N/A"}</p>
              <button
                onClick={() => setEditing(true)}
                className="text-sm text-indigo-600 hover:underline"
              >
                Edit
              </button>
            </div>
          )}

          {/* 🔹 AI Recommendations */}
          <h3 className="mt-4 font-semibold">AI Recommendations:</h3>
          <ul className="list-disc pl-6">
            {patientData.recommendations.map((rec: any, idx: number) => (
              <li key={idx}>{rec.title}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 🔹 Vitals Charts */}
      {vitals.length > 0 && (
        <div className="mt-6 space-y-8">
          <h3 className="text-xl font-semibold text-indigo-700">Vitals Over Time</h3>

          {/* Temperature Chart */}
          <div>
            <h4 className="text-lg font-medium mb-2">Temperature (°C)</h4>
            <Line
              data={{
                labels: vitals.map((v) => new Date(v.timestamp).toLocaleDateString()),
                datasets: [
                  {
                    label: "Temperature",
                    data: vitals.map((v) => v.temperature),
                    borderColor: "rgb(239, 68, 68)",
                    backgroundColor: "rgba(239, 68, 68, 0.2)",
                    tension: 0.3
                  }
                ]
              }}
            />
          </div>

          {/* Heart Rate Chart */}
          <div>
            <h4 className="text-lg font-medium mb-2">Heart Rate (bpm)</h4>
            <Line
              data={{
                labels: vitals.map((v) => new Date(v.timestamp).toLocaleDateString()),
                datasets: [
                  {
                    label: "Heart Rate",
                    data: vitals.map((v) => v.heart_rate),
                    borderColor: "rgb(34, 197, 94)",
                    backgroundColor: "rgba(34, 197, 94, 0.2)",
                    tension: 0.3
                  }
                ]
              }}
            />
          </div>

          {/* Blood Pressure Chart */}
          <div>
            <h4 className="text-lg font-medium mb-2">Blood Pressure (systolic/diastolic)</h4>
            <Line
              data={{
                labels: vitals.map((v) => new Date(v.timestamp).toLocaleDateString()),
                datasets: [
                  {
                    label: "Systolic",
                    data: vitals.map((v) => parseInt(v.blood_pressure?.split("/")[0] || "0")),
                    borderColor: "rgb(59, 130, 246)",
                    backgroundColor: "rgba(59, 130, 246, 0.2)",
                    tension: 0.3
                  },
                  {
                    label: "Diastolic",
                    data: vitals.map((v) => parseInt(v.blood_pressure?.split("/")[1] || "0")),
                    borderColor: "rgb(99, 102, 241)",
                    backgroundColor: "rgba(99, 102, 241, 0.2)",
                    tension: 0.3
                  }
                ]
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}