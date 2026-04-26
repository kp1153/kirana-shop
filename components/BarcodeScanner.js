"use client";
import { useEffect, useRef, useState } from "react";

export default function BarcodeScanner({ onScan, onClose }) {
  const [error, setError] = useState("");
  const [manual, setManual] = useState("");
  const scannerRef = useRef(null);
  const scannerIdRef = useRef("barcode-scanner-region");
  const startedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (cancelled) return;
        const html5Qrcode = new Html5Qrcode(scannerIdRef.current);
        scannerRef.current = html5Qrcode;
        startedRef.current = true;

        await html5Qrcode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 260, height: 140 } },
          (decodedText) => {
            if (decodedText && onScan) onScan(decodedText.trim());
          },
          () => { /* per-frame failures — ignore */ }
        );
      } catch (e) {
        setError("कैमरा नहीं खुला — अनुमति चेक करो या नीचे से barcode टाइप करो");
      }
    }

    start();

    return () => {
      cancelled = true;
      if (scannerRef.current && startedRef.current) {
        scannerRef.current.stop().catch(() => {}).finally(() => {
          try { scannerRef.current.clear(); } catch {}
          startedRef.current = false;
        });
      }
    };
  }, [onScan]);

  function handleManualSubmit() {
    const code = manual.trim();
    if (code && onScan) onScan(code);
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", maxWidth: "400px", width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <span style={{ fontSize: "18px", fontWeight: "800", color: "#14532d" }}>📷 Barcode स्कैन</span>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#374151" }}>✕</button>
        </div>

        <div id={scannerIdRef.current} style={{ width: "100%", minHeight: "240px", background: "#000", borderRadius: "10px", overflow: "hidden" }} />

        {error && (
          <p style={{ color: "#dc2626", fontSize: "13px", margin: "12px 0", textAlign: "center" }}>{error}</p>
        )}

        <div style={{ marginTop: "12px", borderTop: "1px solid #e5e7eb", paddingTop: "12px" }}>
          <label style={{ fontSize: "12px", color: "#6b7280", display: "block", marginBottom: "6px" }}>या barcode नंबर टाइप करो</label>
          <div style={{ display: "flex", gap: "6px" }}>
            <input
              value={manual}
              onChange={e => setManual(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleManualSubmit()}
              placeholder="जैसे: 8901030865278"
              style={{ flex: 1, padding: "10px 12px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "15px", outline: "none" }}
            />
            <button onClick={handleManualSubmit}
              style={{ background: "#14532d", color: "#fff", border: "none", borderRadius: "10px", padding: "0 16px", fontWeight: "700", cursor: "pointer" }}>
              ✓
            </button>
          </div>
          <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: "8px", textAlign: "center" }}>USB barcode scanner भी काम करेगा — यहाँ scan करो</p>
        </div>
      </div>
    </div>
  );
}