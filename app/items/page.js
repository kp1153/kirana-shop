"use client";
import { useState, useEffect } from "react";

const CATEGORIES = ["अनाज/दालें", "तेल/घी", "मसाले", "चीनी/गुड़", "पैकेज्ड फूड", "साबुन/डिटर्जेंट", "चाय/कॉफी", "डेयरी", "स्नैक्स", "पर्सनल केयर", "पेय", "अन्य"];

export default function ItemsPage() {
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setLoading(true);
    const res = await fetch("/api/items");
    const data = await res.json();
    setAllItems(data.items || []);
    setLoading(false);
  }

  async function handleDelete(id) {
    if (!confirm("क्या सच में यह सामान हटाना है?")) return;
    setDeleting(id);
    await fetch(`/api/items/${id}`, { method: "DELETE" });
    setAllItems(prev => prev.filter(i => i.id !== id));
    setDeleting(null);
  }

  async function handleSave() {
    setSaving(true);
    await fetch(`/api/items/${editItem.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hindiName: editItem.hindiName,
        name: editItem.name,
        category: editItem.category,
        unit: editItem.unit,
        mrp: parseFloat(editItem.mrp),
        purchasePrice: parseFloat(editItem.purchasePrice) || null,
        stock: parseFloat(editItem.stock),
        minStock: parseFloat(editItem.minStock),
        gst: parseFloat(editItem.gst),
      }),
    });
    await fetchItems();
    setEditItem(null);
    setSaving(false);
  }

  const filtered = allItems.filter(i =>
    !search ||
    (i.hindiName && i.hindiName.includes(search)) ||
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const lowStock = allItems.filter(i => i.active && i.stock <= i.minStock);

  return (
    <main style={{ minHeight: "100vh", background: "#f0fdf4", paddingBottom: "72px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Baloo 2', sans-serif; box-sizing: border-box; }
        .topbar { background: #14532d; color: #fff; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
        .item-row { background: #fff; border-radius: 12px; padding: 12px 14px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
        .low-badge { background: #fee2e2; color: #dc2626; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 999px; }
        .btn-edit { background: #eff6ff; color: #1d4ed8; border: none; border-radius: 8px; padding: 6px 12px; font-size: 13px; font-weight: 700; cursor: pointer; }
        .btn-del { background: #fef2f2; color: #dc2626; border: none; border-radius: 8px; padding: 6px 12px; font-size: 13px; font-weight: 700; cursor: pointer; }
        .bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; background: #14532d; display: flex; justify-content: space-around; align-items: center; padding: 8px 0; z-index: 50; }
        .bnav-btn { display: flex; flex-direction: column; align-items: center; gap: 2px; color: #fff; text-decoration: none; font-size: 11px; font-weight: 700; opacity: 0.75; }
        .bnav-btn.active { opacity: 1; }
        .bnav-icon { font-size: 22px; }
        .modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 100; display: flex; align-items: flex-end; justify-content: center; }
        .modal { background: #fff; border-radius: 20px 20px 0 0; padding: 24px 20px; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; }
        .field { margin-bottom: 14px; }
        .field label { display: block; font-size: 13px; font-weight: 700; color: #374151; margin-bottom: 4px; }
        .field input, .field select { width: 100%; border: 1.5px solid #d1d5db; border-radius: 10px; padding: 10px 12px; font-size: 15px; font-family: 'Baloo 2', sans-serif; }
        .field input:focus, .field select:focus { outline: none; border-color: #16a34a; }
        .search-box { width: 100%; border: 1.5px solid #d1d5db; border-radius: 12px; padding: 10px 14px; font-size: 15px; font-family: 'Baloo 2', sans-serif; margin-bottom: 14px; }
        .search-box:focus { outline: none; border-color: #16a34a; }
      `}</style>

      <div className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <a href="/dashboard" style={{ color: "#fff", textDecoration: "none", fontSize: "20px" }}>←</a>
          <span style={{ fontSize: "18px", fontWeight: "800" }}>📦 सामान ({allItems.length})</span>
        </div>
        <a href="/items/new" style={{ background: "#fff", color: "#14532d", padding: "8px 16px", borderRadius: "10px", textDecoration: "none", fontWeight: "700", fontSize: "14px" }}>+ नया</a>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "16px" }}>

        {lowStock.length > 0 && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "14px", padding: "14px 16px", marginBottom: "16px" }}>
            <p style={{ fontWeight: "700", color: "#dc2626", margin: "0 0 8px", fontSize: "15px" }}>⚠️ {lowStock.length} सामान कम है</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {lowStock.map(i => (
                <span key={i.id} style={{ background: "#fff", border: "1px solid #fecaca", borderRadius: "8px", padding: "4px 10px", fontSize: "13px", color: "#991b1b" }}>
                  {i.hindiName || i.name}: {i.stock} {i.unit}
                </span>
              ))}
            </div>
          </div>
        )}

        <input
          className="search-box"
          placeholder="🔍 सामान खोजो..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {loading ? (
          <div style={{ textAlign: "center", padding: "48px", color: "#6b7280" }}>लोड हो रहा है...</div>
        ) : allItems.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: "16px", padding: "48px", textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>📦</div>
            <p style={{ color: "#6b7280", fontSize: "15px", marginBottom: "16px" }}>अभी कोई सामान नहीं है</p>
            <a href="/items/new" style={{ background: "#16a34a", color: "#fff", padding: "12px 28px", borderRadius: "12px", textDecoration: "none", fontWeight: "700" }}>पहला सामान जोड़ो</a>
          </div>
        ) : (
          CATEGORIES.map(cat => {
            const catItems = filtered.filter(i => i.category === cat);
            if (catItems.length === 0) return null;
            return (
              <div key={cat} style={{ marginBottom: "20px" }}>
                <p style={{ fontWeight: "700", fontSize: "16px", color: "#14532d", margin: "0 0 10px" }}>{cat} ({catItems.length})</p>
                {catItems.map(item => (
                  <div key={item.id} className="item-row">
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "700", fontSize: "15px" }}>{item.hindiName || item.name}</div>
                      <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
                        MRP: ₹{item.mrp} · स्टॉक: {item.stock} {item.unit}
                        {item.brand && ` · ${item.brand}`}
                      </div>
                      {item.stock <= item.minStock && <span className="low-badge">कम स्टॉक</span>}
                    </div>
                    <div style={{ display: "flex", gap: "6px", marginLeft: "10px" }}>
                      <button className="btn-edit" onClick={() => setEditItem({ ...item })}>✏️ बदलो</button>
                      <button
                        className="btn-del"
                        onClick={() => handleDelete(item.id)}
                        disabled={deleting === item.id}
                      >
                        {deleting === item.id ? "..." : "🗑️"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })
        )}
      </div>

      {editItem && (
        <div className="modal-bg" onClick={e => e.target === e.currentTarget && setEditItem(null)}>
          <div className="modal">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <span style={{ fontSize: "18px", fontWeight: "800" }}>✏️ सामान बदलो</span>
              <button onClick={() => setEditItem(null)} style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer" }}>✕</button>
            </div>

            <div className="field">
              <label>नाम (हिंदी)</label>
              <input value={editItem.hindiName || ""} onChange={e => setEditItem({ ...editItem, hindiName: e.target.value })} placeholder="जैसे: आटा" />
            </div>
            <div className="field">
              <label>Category</label>
              <select value={editItem.category} onChange={e => setEditItem({ ...editItem, category: e.target.value })}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="field">
                <label>MRP (₹)</label>
                <input type="number" value={editItem.mrp} onChange={e => setEditItem({ ...editItem, mrp: e.target.value })} />
              </div>
              <div className="field">
                <label>खरीद भाव (₹)</label>
                <input type="number" value={editItem.purchasePrice || ""} onChange={e => setEditItem({ ...editItem, purchasePrice: e.target.value })} />
              </div>
              <div className="field">
                <label>स्टॉक</label>
                <input type="number" value={editItem.stock} onChange={e => setEditItem({ ...editItem, stock: e.target.value })} />
              </div>
              <div className="field">
                <label>कम स्टॉक Alert</label>
                <input type="number" value={editItem.minStock} onChange={e => setEditItem({ ...editItem, minStock: e.target.value })} />
              </div>
              <div className="field">
                <label>इकाई</label>
                <select value={editItem.unit} onChange={e => setEditItem({ ...editItem, unit: e.target.value })}>
                  <option value="किलो">किलो</option>
                  <option value="नग">नग</option>
                  <option value="लीटर">लीटर</option>
                  <option value="ग्राम">ग्राम</option>
                  <option value="मिली">मिली</option>
                  <option value="दर्जन">दर्जन</option>
                  <option value="पैकेट">पैकेट</option>
                </select>
              </div>
              <div className="field">
                <label>GST (%)</label>
                <input type="number" value={editItem.gst} onChange={e => setEditItem({ ...editItem, gst: e.target.value })} />
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              style={{ width: "100%", background: "#16a34a", color: "#fff", border: "none", borderRadius: "12px", padding: "14px", fontSize: "16px", fontWeight: "800", cursor: "pointer", marginTop: "8px" }}
            >
              {saving ? "सेव हो रहा है..." : "✅ सेव करो"}
            </button>
          </div>
        </div>
      )}

      <nav className="bottom-nav">
        <a href="/dashboard" className="bnav-btn"><span className="bnav-icon">🏠</span>होम</a>
        <a href="/billing" className="bnav-btn"><span className="bnav-icon">🧾</span>बिल</a>
        <a href="/items" className="bnav-btn active"><span className="bnav-icon">📦</span>सामान</a>
        <a href="/udhar" className="bnav-btn"><span className="bnav-icon">💰</span>उधारी</a>
        <a href="/settings" className="bnav-btn"><span className="bnav-icon">⚙️</span>Settings</a>
      </nav>
    </main>
  );
}