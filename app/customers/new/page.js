"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCustomerPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!form.name.trim()) { setError("नाम ज़रूरी है"); return; }
    setLoading(true);
    const res = await fetch("/api/customers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) router.push("/customers");
    else { setError("कुछ गलत हुआ"); setLoading(false); }
  }

  const inputStyle = { width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1.5px solid #e5e7eb", fontSize: "16px", outline: "none", fontFamily: "'Baloo 2', sans-serif" };

  return (
    <main style={{ minHeight: "100vh", background: "#f0fdf4" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700;800&display=swap'); * { font-family: 'Baloo 2', sans-serif; box-sizing: border-box; }`}</style>
      <div style={{ background: "#14532d", color: "#fff", padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px", position: "sticky", top: 0 }}>
        <a href="/customers" style={{ color: "#fff", textDecoration: "none", fontSize: "20px" }}>←</a>
        <span style={{ fontSize: "18px", fontWeight: "800" }}>👤 नया ग्राहक</span>
      </div>
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "16px" }}>
        <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div><label style={{ fontSize: "13px", color: "#6b7280", display: "block", marginBottom: "4px", fontWeight: "600" }}>नाम *</label><input style={inputStyle} placeholder="ग्राहक का पूरा नाम" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
          <div><label style={{ fontSize: "13px", color: "#6b7280", display: "block", marginBottom: "4px", fontWeight: "600" }}>मोबाइल नंबर</label><input style={inputStyle} placeholder="10 अंक का नंबर" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
          <div><label style={{ fontSize: "13px", color: "#6b7280", display: "block", marginBottom: "4px", fontWeight: "600" }}>पता</label><textarea style={{...inputStyle, resize: "none"}} rows={3} placeholder="घर का पता" value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
          {error && <p style={{ color: "#dc2626", fontSize: "14px", margin: 0 }}>{error}</p>}
          <button onClick={handleSubmit} disabled={loading}
            style={{ background: "linear-gradient(135deg, #16a34a, #15803d)", color: "#fff", padding: "14px", borderRadius: "14px", fontSize: "16px", fontWeight: "800", border: "none", cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
            {loading ? "Save हो रहा है..." : "✅ ग्राहक Save करो"}
          </button>
        </div>
      </div>
    </main>
  );
}