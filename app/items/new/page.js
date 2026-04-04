"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = ["अनाज/दालें", "तेल/घी", "मसाले", "चीनी/गुड़", "पैकेज्ड फूड", "साबुन/डिटर्जेंट", "चाय/कॉफी", "डेयरी", "स्नैक्स", "पर्सनल केयर", "पेय", "अन्य"];
const UNITS = ["kg", "g", "litre", "ml", "piece", "dozen", "packet", "box", "bottle"];

export default function NewItemPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", hindiName: "", category: "", brand: "", unit: "kg", mrp: "", purchasePrice: "", stock: "", minStock: "5", gst: "5", expiry: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!form.name || !form.category || !form.mrp) { setError("नाम, कैटेगरी और MRP ज़रूरी है"); return; }
    setLoading(true);
    const res = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, mrp: parseFloat(form.mrp), purchasePrice: parseFloat(form.purchasePrice) || null, stock: parseFloat(form.stock) || 0, minStock: parseFloat(form.minStock) || 5, gst: parseFloat(form.gst) || 5 }),
    });
    if (res.ok) router.push("/items");
    else { setError("कुछ गलत हुआ"); setLoading(false); }
  }

  const inputStyle = { width: "100%", padding: "12px 14px", borderRadius: "12px", border: "1.5px solid #e5e7eb", fontSize: "15px", outline: "none", fontFamily: "'Baloo 2', sans-serif" };
  const labelStyle = { fontSize: "13px", color: "#6b7280", display: "block", marginBottom: "4px", fontWeight: "600" };

  return (
    <main style={{ minHeight: "100vh", background: "#f0fdf4" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700;800&display=swap'); * { font-family: 'Baloo 2', sans-serif; box-sizing: border-box; }`}</style>

      <div style={{ background: "#14532d", color: "#fff", padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px", position: "sticky", top: 0, zIndex: 50 }}>
        <a href="/items" style={{ color: "#fff", textDecoration: "none", fontSize: "20px" }}>←</a>
        <span style={{ fontSize: "18px", fontWeight: "800" }}>📦 नया सामान जोड़ो</span>
      </div>

      <div style={{ maxWidth: "500px", margin: "0 auto", padding: "16px" }}>
        <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>

          <div><label style={labelStyle}>सामान का नाम (English) *</label><input style={inputStyle} placeholder="जैसे: Aashirvaad Atta 5kg" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
          <div><label style={labelStyle}>हिंदी नाम</label><input style={inputStyle} placeholder="जैसे: आशीर्वाद आटा 5 किलो" value={form.hindiName} onChange={e => setForm({...form, hindiName: e.target.value})} /></div>

          <div><label style={labelStyle}>कैटेगरी *</label>
            <select style={inputStyle} value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              <option value="">कैटेगरी चुनो</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div><label style={labelStyle}>Brand</label><input style={inputStyle} placeholder="जैसे: Patanjali" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} /></div>
            <div><label style={labelStyle}>Unit</label>
              <select style={inputStyle} value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}>
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div><label style={labelStyle}>बिक्री मूल्य MRP (₹) *</label><input type="number" style={inputStyle} placeholder="0" value={form.mrp} onChange={e => setForm({...form, mrp: e.target.value})} /></div>
            <div><label style={labelStyle}>खरीद मूल्य (₹)</label><input type="number" style={inputStyle} placeholder="0" value={form.purchasePrice} onChange={e => setForm({...form, purchasePrice: e.target.value})} /></div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div><label style={labelStyle}>अभी स्टॉक</label><input type="number" style={inputStyle} placeholder="0" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} /></div>
            <div><label style={labelStyle}>कम से कम स्टॉक</label><input type="number" style={inputStyle} placeholder="5" value={form.minStock} onChange={e => setForm({...form, minStock: e.target.value})} /></div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div><label style={labelStyle}>GST %</label>
              <select style={inputStyle} value={form.gst} onChange={e => setForm({...form, gst: e.target.value})}>
                <option value="0">0%</option><option value="5">5%</option><option value="12">12%</option><option value="18">18%</option><option value="28">28%</option>
              </select>
            </div>
            <div><label style={labelStyle}>Expiry Date</label><input type="date" style={inputStyle} value={form.expiry} onChange={e => setForm({...form, expiry: e.target.value})} /></div>
          </div>

          {error && <p style={{ color: "#dc2626", fontSize: "14px", margin: 0 }}>{error}</p>}

          <button onClick={handleSubmit} disabled={loading}
            style={{ background: "linear-gradient(135deg, #16a34a, #15803d)", color: "#fff", padding: "14px", borderRadius: "14px", fontSize: "16px", fontWeight: "800", border: "none", cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
            {loading ? "Save हो रहा है..." : "✅ सामान Save करो"}
          </button>
        </div>
      </div>
    </main>
  );
}