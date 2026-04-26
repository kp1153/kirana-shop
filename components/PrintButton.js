"use client";

export default function PrintButton({ label = "🖨️ Print" }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print"
      style={{ background: "#14532d", color: "#fff", padding: "14px", borderRadius: "14px", fontSize: "16px", fontWeight: "800", border: "none", cursor: "pointer", width: "100%", fontFamily: "'Baloo 2', sans-serif" }}
    >
      {label}
    </button>
  );
}