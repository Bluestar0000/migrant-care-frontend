const API_BASE = "http://127.0.0.1:8000";

export async function loginUser(username, password) {
  const response = await fetch(`${API_BASE}/api/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) throw await response.json();
  return response.json();
}

export async function lookupPatient(value) {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE}/get-patient-by-qr/${value}/`, {
    headers: { Authorization: `Token ${token}` },
  });
  if (!response.ok) throw await response.json();
  return response.json();
}
