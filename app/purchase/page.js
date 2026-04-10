"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PurchasePage() {
  const router = useRouter();
  const [allItems, setAllItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [supplier, setSupplier] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/items").then(r => r.json()).then(d => setAllItems(d.items || []));
  }, []);

  useEffect(() => {
    if (!search.trim()) { setResults([]); return; }
    setResults(allItems.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || (i.hindiName && i.hindiName.includes(search))).slice(0, 6));
  }, [search, allItems]);

  function addToCart(item) {
    setCart(prev => {
      const existing = prev.find(c => c.itemId === item.id);
      if (existing) return prev;
      return [...prev, { itemId: item.id, name: item.hindiName || item.name, qty: 1, purchasePrice: item.purchasePrice || 0, mrp: item.mrp, expiry: "", amount: item.purchasePrice || 0 }];
    });
    setSearch(""); setResults([]);
  }

  function updateCart(itemId, field, value) {
    setCart(prev => prev.map(c => {
      if (c.itemId !== itemId) return c;
      const updated = { ...c, [field]: value };
      updated.amount = updated.qty * updated.purchasePrice;
      return updated;
    }));
  }

  const total = cart.reduce((s, i) => s + i.amount, 0);

  async function savePurchase() {
    if (cart.length === 0) return;
    setLoading(true);
    await fetch("/api/purchases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ supplierName: supplier, invoiceNo, items: cart, paid: total }),
    });
    alert("खरीद save हो गई! स्टॉक update हो गया।");
    setCart([]); setSupplier(""); setInvoiceNo("");
    setLoading(false);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f0fdf4", paddingBottom: "72px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700;800&display=swap');
        * { font-family: 'Baloo 2', sans-serif; box-sizing: border-box; }
        .bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; background: #14532d; display: flex; justify-content: space-around; align-items: center; padding: 8px 0; z-index: 50; }
        .bnav-btn { display: flex; flex-direction: column; align-items: center; gap: 2px; color: #fff; text-decoration: none; font-size: 11px; font-weight: 700; opacity: 0.75; }
        .bnav-btn.active { opacity: 1; }
        .bnav-icon { font-size: 22px; }
      `}</style>

      <div style={{ background: "#14532d", color: "#fff", padding: "12px 20px", display: "flex", alignItems: "center", gap: "12px", position: "sticky", top: 0, zIndex: 50 }}>
        <a href="/dashboard" style={{ color: "#fff", textDecoration: "none", fontSize: "20px" }}>←</a>
        <span style={{ fontSize: "18px", fontWeight: "800" }}>🚚 खरीद दर्ज करो</span>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "16px" }}>

        <div style={{ background: "#fff", borderRadius: "16px", padding: "16px", marginBottom: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <input placeholder="Supplier का नाम" value={supplier} onChange={e => setSupplier(e.target.value)}
            style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "14px", outline: "none" }} />
          <input placeholder="Invoice No." value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)}
            style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "14px", outline: "none" }} />
        </div>

        <div style={{ position: "relative", marginBottom: "16px" }}>
          <input placeholder="🔍 सामान खोजो..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "2px solid #e5e7eb", fontSize: "15px", outline: "none" }} />
          {results.length > 0 && (
            <div style={{ position: "absolute", width: "100%", background: "#fff", borderRadius: "0 0 14px 14px", border: "1px solid #e5e7eb", zIndex: 100, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
              {results.map(item => (
                <div key={item.id} onClick={() => addToCart(item)}
                  style={{ padding: "12px 16px", cursor: "pointer", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: "700" }}>{item.hindiName || item.name}</span>
                  <span style={{ color: "#6b7280", fontSize: "13px" }}>स्टॉक: {item.stock}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.map(item => (
          <div key={item.itemId} style={{ background: "#fff", borderRadius: "14px", padding: "14px", marginBottom: "8px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ fontWeight: "700", fontSize: "15px", marginBottom: "10px" }}>{item.name}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <div>
                <label style={{ fontSize: "11px", color: "#6b7280", display: "block", marginBottom: "3px" }}>मात्रा</label>
                <input type="number" value={item.qty} onChange={e => updateCart(item.itemId, "qty", parseFloat(e.target.value) || 0)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none" }} />
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "#6b7280", display: "block", marginBottom: "3px" }}>खरीद भाव ₹</label>
                <input type="number" value={item.purchasePrice} onChange={e => updateCart(item.itemId, "purchasePrice", parseFloat(e.target.value) || 0)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none" }} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ fontSize: "11px", color: "#6b7280", display: "block", marginBottom: "3px" }}>Expiry</label>
                <input type="date" value={item.expiry} onChange={e => updateCart(item.itemId, "expiry", e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none" }} />
              </div>
            </div>
            <div style={{ marginTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: "800", color: "#14532d" }}>₹{item.amount.toLocaleString("hi-IN")}</span>
              <button onClick={() => setCart(prev => prev.filter(c => c.itemId !== item.itemId))}
                style={{ background: "#fee2e2", color: "#dc2626", border: "none", borderRadius: "8px", padding: "6px 12px", cursor: "pointer", fontSize: "13px", fontWeight: "600" }}>
                हटाओ
              </button>
            </div>
          </div>
        ))}

        {cart.length > 0 && (
          <div style={{ background: "#14532d", borderRadius: "16px", padding: "16px", marginTop: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ color: "#86efac", fontSize: "14px" }}>कुल खरीद</div>
              <div style={{ color: "#fff", fontSize: "24px", fontWeight: "800" }}>₹{total.toLocaleString("hi-IN")}</div>
            </div>
            <button onClick={savePurchase} disabled={loading}
              style={{ background: "#fff", color: "#14532d", padding: "12px 24px", borderRadius: "12px", border: "none", fontWeight: "800", fontSize: "15px", cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
              {loading ? "Save..." : "✅ Save करो"}
            </button>
          </div>
        )}
      </div>

      <nav className="bottom-nav">
        <a href="/dashboard" className="bnav-btn"><span className="bnav-icon">🏠</span>होम</a>
        <a href="/billing" className="bnav-btn"><span className="bnav-icon">🧾</span>बिल</a>
        <a href="/items" className="bnav-btn"><span className="bnav-icon">📦</span>सामान</a>
        <a href="/udhar" className="bnav-btn"><span className="bnav-icon">💰</span>उधारी</a>
        <a href="/settings" className="bnav-btn"><span className="bnav-icon">⚙️</span>Settings</a>
      </nav>

    </main>
  );
}