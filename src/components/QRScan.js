// src/components/QRScan.js
import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QRScan = ({ onScan }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: 250,
    });

    scanner.render(
      (decodedText) => {
        onScan(decodedText);
        scanner.clear(); // stop after first scan
      },
      (error) => {
        // ignore scan errors
      }
    );

    return () => scanner.clear();
  }, [onScan]);

  return <div id="reader" style={{ width: "400px" }} />;
};

export default QRScan;