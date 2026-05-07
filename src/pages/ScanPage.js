// src/pages/ScanPage.js

import React, { useState } from "react";
import QRScan from "../components/QRScan";
import { lookupPatient } from "../api/lookup";

const ScanPage = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleScan = async (value) => {
    try {
      const data = await lookupPatient(value);
      setResult(data);
      setError(null);
    } catch (err) {
      setResult(null);
      setError(err.detail || "Scan failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Scan Patient QR</h1>
      <QRScan onScan={handleScan} />
      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold">Patient Details</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default ScanPage;