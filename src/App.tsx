import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import './App.css';

// 🔹 Login Component
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("migrant");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

      const res = await fetch("https://migrant-care-backend.onrender.com/api/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("authToken", data.token);
      navigate(`/${data.role}/dashboard`, {
        state: { username: data.username }
      });
    } else {
      setError(data.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">Migrant Care Nexus</h2>
        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex justify-between items-center text-sm text-gray-600">
            {["migrant", "doctor", "authority"].map((r) => (
              <label key={r} className="flex items-center gap-2">
                <input
                  type="radio"
                  value={r}
                  checked={role === r}
                  onChange={() => setRole(r)}
                />
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </label>
            ))}
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            Login as {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        </form>
      </div>
    </div>
  );
}

// 🔹 Dashboard Template
function Dashboard({ role }: { role: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username || "User";

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) navigate("/");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-indigo-700">
        {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
      </h1>
      <p className="text-gray-600">Welcome, {username}!</p>
      <button onClick={handleLogout} className="btn btn-outline mt-4">
        Logout
      </button>
    </div>
  );
}

// 🔹 Role-Specific Dashboards
const AuthoritiesDashboard = () => <Dashboard role="authority" />;
const DoctorDashboard = () => <Dashboard role="doctor" />;
const MigrantDashboard = () => <Dashboard role="migrant" />;

// 🔹 App Wrapper with Routing
function AppWrapper() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/authority/dashboard" element={<AuthoritiesDashboard />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/migrant/dashboard" element={<MigrantDashboard />} />
      </Routes>
    </div>
  );
}

// 🔹 Main App Entry
export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}