import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import StatCard from "../../Components/StatCard"; // adjust path if needed

export default function MigrantDashboard() {
  const location = useLocation();
  const username = location.state?.username || "Migrant";
  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    fetch("http://127.0.0.1:8000/api/migrant/dashboard/", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Failed to fetch dashboard data", err));
  }, []);
  <div className="flex justify-between items-center mb-6">
  <h1 className="text-2xl font-bold text-indigo-700">
    Welcome, {username.charAt(0).toUpperCase() + username.slice(1)}!
  </h1>
  <button
    onClick={() => {
      localStorage.clear();
      navigate("/");
    }}
    className="text-sm text-red-600 hover:underline"
  >
    Logout
  </button>
</div>


  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        Welcome, {username.charAt(0).toUpperCase() + username.slice(1)}!
      </h1>

      {data ? (
        <>
          {/* 🔹 Stat Cards Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard title="Appointments" value={data?.appointments || 0} />
            <StatCard title="Health Alerts" value={data?.alerts || 0} />
            <StatCard title="Eligible Schemes" value={data?.schemes?.length || 0} />
          </div>

          {/* 🔹 Additional Info */}
          <div className="mt-6 space-y-2">
            <p>Age: {data?.profile?.age}</p>
            <p>Gender: {data?.profile?.gender}</p>
            <p>Latest Diagnosis: {data?.medical_record?.diagnosis || "N/A"}</p>
            <p>Eligible Schemes: {data?.schemes?.length}</p>
            <p className="font-semibold">AI Recommendations:</p>
            <ul className="list-disc pl-6">
              {data?.recommendations?.map((rec: string, idx: number) => (
                <li key={idx}>{rec}</li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <p>Loading dashboard data...</p>
      )}
    </div>
  );
}