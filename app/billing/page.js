"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function BillingPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [allItems, setAllItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMode, setPaymentMode] = useState("cash");
  const [discount, setDiscount] = useState(0);
  const [paid, setPaid] = useState(0);
  const [loading, setLoading] = useState(false);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const searchRef = useRef(null);

  useEffect(() => {
    fetch("/api/customers").then(r => r.json()).then(d => setCustomers(d.customers || [])).catch(() => {});
    setItemsLoading(true);
    fetch("/api/items")
      .then(r => { if (!r.ok) throw new Error("fetch failed"); return r.json(); })
      .then(d => {
        const active = (d.items || []).filter(i => i.active);
        setAllItems(active);
        setSearchResults(active.slice(0, 10));
      })
      .catch(e => console.error("Items load error:", e))
      .finally(() => setItemsLoading(false));
    if (searchRef.current) searchRef.current.focus();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setSearchResults(allItems.slice(0, 10));
      return;
    }
    const q = search.toLowerCase();
    const filtered = allItems.filter(i =>
      i.name.toLowerCase().includes(q) ||
      (i.hindiName && i.hindiName.includes(search)) ||
      (i.barcode && i.barcode.includes(search))
    ).slice(0, 10);
    setSearchResults(filtered);
  }, [search, allItems]);

  function addToCart(item) {
    setCart(prev => {
      const existing = prev.find(c => c.itemId === item.id);
      if (existing) {
        return prev.map(c => c.itemId === item.id
          ? { ...c, qty: c.qty + 1, amount: (c.qty + 1) * c.mrp }
          : c);
      }
      return [...prev, { itemId: item.id, name: item.hindiName || item.name, unit: item.unit, qty: 1, mrp: item.mrp, gst: item.gst || 0, discount: 0, amount: item.mrp }];
    });
    setSearch("");
    setShowDropdown(false);
    if (searchRef.current) searchRef.current.focus();
  }

  function updateQty(itemId, qty) {
    if (qty <= 0) { removeFromCart(itemId); return; }
    setCart(prev => prev.map(c => c.itemId === itemId ? { ...c, qty, amount: qty * c.mrp } : c));
  }

  function removeFromCart(itemId) {
    setCart(prev => prev.filter(c => c.itemId !== itemId));
  }

  const subtotal = cart.reduce((s, i) => s + i.amount, 0);
  const total = subtotal - (parseFloat(discount) || 0);
  const balance = total - (parseFloat(paid) || 0);

  async function saveBill() {
    if (cart.length === 0) return;
    setLoading(true);
    const res = await fetch("/api/bills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: customerName || "नकद ग्राहक",
        customerPhone: customerPhone || null,
        items: cart,
        discount: parseFloat(discount) || 0,
        paymentMode,
        paid: parseFloat(paid) || (paymentMode === "cash" ? total : 0),
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setCart([]); setCustomerName(""); setCustomerPhone("");
      setDiscount(0); setPaid(0); setPaymentMode("cash");
      alert(`बिल बन गया! ${data.bill.billNo}\nकुल: ₹${total}`);
    }
    setLoading(false);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f0fdf4", paddingBottom: "72px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Baloo 2', sans-serif; box-sizing: border-box; }
        .topbar { background: #14532d; color: #fff; padding: 12px 20px; display: flex; align-items: center; gap: 12px; position: sticky; top: 0; z-index: 50; }
        .search-box { flex: 1; padding: 12px 16px; border-radius: 12px; border: 2px solid #e5e7eb; font-size: 16px; outline: none; }
        .search-box:focus { border-color: #16a34a; }
        .search-result { background: #fff; border: 1px solid #e5e7eb; border-radius: 0 0 14px 14px; position: absolute; width: 100%; z-index: 100; box-shadow: 0 8px 24px rgba(0,0,0,0.12); max-height: 320px; overflow-y: auto; }
        .result-item { padding: 12px 16px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f3f4f6; }
        .result-item:hover { background: #f0fdf4; }
        .cart-item { background: #fff; border-radius: 12px; padding: 12px 14px; display: flex; align-items: center; gap: 10px; margin-bottom: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
        .qty-btn { width: 32px; height: 32px; border-radius: 8px; border: none; font-size: 18px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .qty-minus { background: #fee2e2; color: #dc2626; }
        .qty-plus { background: #dcfce7; color: #16a34a; }
        .qty-val { width: 36px; text-align: center; font-weight: 700; font-size: 16px; }
        .pay-btn { background: linear-gradient(135deg, #16a34a, #15803d); color: #fff; padding: 16px; border-radius: 16px; font-size: 18px; font-weight: 800; border: none; cursor: pointer; width: 100%; transition: all 0.2s; }
        .pay-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(22,163,74,0.3); }
        .pay-btn:disabled { opacity: 0.6; }
        .mode-btn { padding: 10px 16px; border-radius: 10px; border: 2px solid #e5e7eb; font-size: 14px; font-weight: 600; cursor: pointer; background: #fff; transition: all 0.2s; }
        .mode-btn.active { border-color: #16a34a; background: #dcfce7; color: #15803d; }
        .bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; background: #14532d; display: flex; justify-content: space-around; align-items: center; padding: 8px 0; z-index: 50; }
        .bnav-btn { display: flex; flex-direction: column; align-items: center; gap: 2px; color: #fff; text-decoration: none; font-size: 11px; font-weight: 700; opacity: 0.75; }
        .bnav-btn.active { opacity: 1; }
        .bnav-icon { font-size: 22px; }
        input[type=number] { -moz-appearance: textfield; }
        input[type=number]::-webkit-outer-spin-button, input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
      `}</style>

      <div className="topbar">
        <a href="/dashboard" style={{ color: "#fff", textDecoration: "none", fontSize: "20px" }}>←</a>
        <span style={{ fontSize: "18px", fontWeight: "800" }}>🧾 नया बिल</span>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "16px" }}>

        <div style={{ position: "relative", marginBottom: "16px" }}>
          <input
            ref={searchRef}
            className="search-box"
            style={{ width: "100%" }}
            placeholder={itemsLoading ? "⏳ सामान लोड हो रहा है..." : "🔍 सामान का नाम लिखो या नीचे से चुनो..."}
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          />
          {showDropdown && searchResults.length > 0 && (
            <div className="search-result">
              {searchResults.map(item => (
                <div key={item.id} className="result-item" onMouseDown={() => addToCart(item)}>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "15px" }}>{item.hindiName || item.name}</div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>{item.category} · स्टॉक: {item.stock} {item.unit}</div>
                  </div>
                  <div style={{ fontWeight: "800", color: "#14532d", fontSize: "16px" }}>₹{item.mrp}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: "16px", padding: "40px", textAlign: "center", marginBottom: "16px" }}>
            <div style={{ fontSize: "48px", marginBottom: "8px" }}>🛒</div>
            <p style={{ color: "#9ca3af", fontSize: "15px" }}>ऊपर सामान का नाम लिखो</p>
          </div>
        ) : (
          <div style={{ marginBottom: "16px" }}>
            {cart.map(item => (
              <div key={item.itemId} className="cart-item">
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "700", fontSize: "15px" }}>{item.name}</div>
                  <div style={{ fontSize: "13px", color: "#6b7280" }}>₹{item.mrp}/{item.unit}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button className="qty-btn qty-minus" onClick={() => updateQty(item.itemId, item.qty - 1)}>−</button>
                  <span className="qty-val">{item.qty}</span>
                  <button className="qty-btn qty-plus" onClick={() => updateQty(item.itemId, item.qty + 1)}>+</button>
                </div>
                <div style={{ fontWeight: "800", fontSize: "16px", color: "#14532d", minWidth: "64px", textAlign: "right" }}>
                  ₹{item.amount.toLocaleString("hi-IN")}
                </div>
              </div>
            ))}
          </div>
        )}

        {cart.length > 0 && (
          <>
            <div style={{ background: "#fff", borderRadius: "16px", padding: "16px", marginBottom: "16px" }}>
              <p style={{ fontWeight: "700", fontSize: "15px", margin: "0 0 10px", color: "#374151" }}>👤 ग्राहक (वैकल्पिक)</p>
              <input placeholder="ग्राहक का नाम" value={customerName} onChange={e => setCustomerName(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "15px", marginBottom: "8px", outline: "none" }} />
              <input placeholder="मोबाइल नंबर" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "15px", outline: "none" }} />
            </div>

            <div style={{ background: "#fff", borderRadius: "16px", padding: "16px", marginBottom: "16px" }}>
              <p style={{ fontWeight: "700", fontSize: "15px", margin: "0 0 12px", color: "#374151" }}>💳 भुगतान</p>
              <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
                {[["cash", "💵 नकद"], ["upi", "📱 UPI"], ["credit", "📒 उधार"]].map(([mode, label]) => (
                  <button key={mode} className={`mode-btn ${paymentMode === mode ? "active" : ""}`}
                    onClick={() => { setPaymentMode(mode); if (mode === "credit") setPaid(0); else setPaid(total); }}>
                    {label}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "12px", color: "#6b7280", display: "block", marginBottom: "4px" }}>छूट (₹)</label>
                  <input type="number" value={discount} onChange={e => setDiscount(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "15px", outline: "none" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "12px", color: "#6b7280", display: "block", marginBottom: "4px" }}>मिले पैसे (₹)</label>
                  <input type="number" value={paid} onChange={e => setPaid(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1.5px solid #e5e7eb", fontSize: "15px", outline: "none" }} />
                </div>
              </div>

              <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#6b7280", marginBottom: "4px" }}>
                  <span>कुल सामान</span><span>₹{subtotal.toLocaleString("hi-IN")}</span>
                </div>
                {discount > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#16a34a", marginBottom: "4px" }}>
                  <span>छूट</span><span>−₹{discount}</span>
                </div>}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "20px", fontWeight: "800", color: "#14532d" }}>
                  <span>कुल</span><span>₹{total.toLocaleString("hi-IN")}</span>
                </div>
                {balance > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#dc2626", marginTop: "4px" }}>
                  <span>उधार</span><span>₹{balance.toLocaleString("hi-IN")}</span>
                </div>}
                {balance < 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#16a34a", marginTop: "4px" }}>
                  <span>वापसी</span><span>₹{Math.abs(balance).toLocaleString("hi-IN")}</span>
                </div>}
              </div>
            </div>

            <button className="pay-btn" onClick={saveBill} disabled={loading}>
              {loading ? "बिल बन रहा है..." : `✅ बिल बनाओ — ₹${total.toLocaleString("hi-IN")}`}
            </button>
          </>
        )}
      </div>

      <nav className="bottom-nav">
        <a href="/dashboard" className="bnav-btn"><span className="bnav-icon">🏠</span>होम</a>
        <a href="/billing" className="bnav-btn active"><span className="bnav-icon">🧾</span>बिल</a>
        <a href="/items" className="bnav-btn"><span className="bnav-icon">📦</span>सामान</a>
        <a href="/udhar" className="bnav-btn"><span className="bnav-icon">💰</span>उधारी</a>
        <a href="/settings" className="bnav-btn"><span className="bnav-icon">⚙️</span>Settings</a>
      </nav>

    </main>
  );
}