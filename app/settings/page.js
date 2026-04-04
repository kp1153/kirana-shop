"use client";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [form, setForm] = useState({ shopName: "", ownerName: "", phone: "", address: "", gstin: "", upiId: "", thankYouMsg: "धन्यवाद! फिर आइएगा।" });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(d => { if (d.settings) setForm(s => ({...s, ...d.settings})); });
  }, []);

  async function handleSave() {
    setLoading(true);
    await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setLoading(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const inputStyle = { width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1.5px solid #e5e7eb", fontSize: "15px", outline: "none", fontFamily: "'Baloo 2', sans-serif" };
  const labelStyle = { fontSize: "13px", color: "#6b7280", display: "block", marginBottom: "4px", fontWeight: "600" };

  return (
    <main style={{ minHeight: "100vh", background: "#f0fdf4" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700;800&display=swap'); * { font-family: 'Baloo 2', sans-serif; box-sizing: border-box; }`}</style>
      <div style={{ background: "#14532d", color: "#fff", padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px", position: "sticky", top: 0, zIndex: 50 }}>
        <a href="/dashboard" style={{ color: "#fff", textDecoration: "none", fontSize: "20px" }}>←</a>
        <span style={{ fontSize: "18px", fontWeight: "800" }}>⚙️ दुकान Settings</span>
      </div>
      <div style={{ maxWidth: "500px", margin: "0 auto", padding: "16px" }}>
        <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
          {[
            { key: "shopName", label: "दुकान का नाम", placeholder: "जैसे: श्री राम किराना स्टोर" },
            { key: "ownerName", label: "मालिक का नाम", placeholder: "आपका नाम" },
            { key: "phone", label: "फोन नंबर", placeholder: "10 अंक का नंबर" },
            { key: "address", label: "पता", placeholder: "दुकान का पूरा पता" },
            { key: "gstin", label: "GSTIN (वैकल्पिक)", placeholder: "GST नंबर" },
            { key: "upiId", label: "UPI ID", placeholder: "yourname@upi" },
            { key: "thankYouMsg", label: "बिल पर संदेश", placeholder: "धन्यवाद! फिर आइएगा।" },
          ].map(f => (
            <div key={f.key}>
              <label style={labelStyle}>{f.label}</label>
              <input style={inputStyle} placeholder={f.placeholder} value={form[f.key] || ""} onChange={e => setForm({...form, [f.key]: e.target.value})} />
            </div>
          ))}
          <button onClick={handleSave} disabled={loading}
            style={{ background: saved ? "#16a34a" : "linear-gradient(135deg, #16a34a, #15803d)", color: "#fff", padding: "14px", borderRadius: "14px", fontSize: "16px", fontWeight: "800", border: "none", cursor: "pointer" }}>
            {loading ? "Save हो रहा है..." : saved ? "✅ Save हो गया!" : "✅ Save करो"}
          </button>
        </div>
      </div>
    </main>
  );
}