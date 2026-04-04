export const dynamic = "force-dynamic";
import { requireAccess } from "@/lib/access";
import { db } from "@/lib/db";
import { items } from "@/lib/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

const CATEGORIES = ["अनाज/दालें", "तेल/घी", "मसाले", "चीनी/गुड़", "पैकेज्ड फूड", "साबुन/डिटर्जेंट", "चाय/कॉफी", "डेयरी", "स्नैक्स", "पर्सनल केयर", "पेय", "अन्य"];

export default async function ItemsPage() {
  const session = await requireAccess();
  const allItems = await db.select().from(items).where(eq(items.userId, session.userId));

  const lowStock = allItems.filter(i => i.active && i.stock <= i.minStock);

  return (
    <main style={{ minHeight: "100vh", background: "#f0fdf4" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Baloo 2', sans-serif; box-sizing: border-box; }
        .topbar { background: #14532d; color: #fff; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
        .item-row { background: #fff; border-radius: 12px; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
        .cat-badge { background: #dcfce7; color: #15803d; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 999px; }
        .low-badge { background: #fee2e2; color: #dc2626; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 999px; }
      `}</style>

      <div className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <a href="/dashboard" style={{ color: "#fff", textDecoration: "none", fontSize: "20px" }}>←</a>
          <span style={{ fontSize: "18px", fontWeight: "800" }}>📦 सामान ({allItems.length})</span>
        </div>
        <Link href="/items/new" style={{ background: "#fff", color: "#14532d", padding: "8px 16px", borderRadius: "10px", textDecoration: "none", fontWeight: "700", fontSize: "14px" }}>+ नया</Link>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "16px" }}>

        {lowStock.length > 0 && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "14px", padding: "14px 16px", marginBottom: "16px" }}>
            <p style={{ fontWeight: "700", color: "#dc2626", margin: "0 0 8px", fontSize: "15px" }}>⚠️ {lowStock.length} सामान कम है</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {lowStock.map(i => <span key={i.id} style={{ background: "#fff", border: "1px solid #fecaca", borderRadius: "8px", padding: "4px 10px", fontSize: "13px", color: "#991b1b" }}>{i.hindiName || i.name}: {i.stock}{i.unit}</span>)}
            </div>
          </div>
        )}

        {allItems.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: "16px", padding: "48px", textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>📦</div>
            <p style={{ color: "#6b7280", fontSize: "15px", marginBottom: "16px" }}>अभी कोई सामान नहीं है</p>
            <Link href="/items/new" style={{ background: "#16a34a", color: "#fff", padding: "12px 28px", borderRadius: "12px", textDecoration: "none", fontWeight: "700" }}>पहला सामान जोड़ो</Link>
          </div>
        ) : (
          CATEGORIES.map(cat => {
            const catItems = allItems.filter(i => i.category === cat);
            if (catItems.length === 0) return null;
            return (
              <div key={cat} style={{ marginBottom: "20px" }}>
                <p style={{ fontWeight: "700", fontSize: "16px", color: "#14532d", margin: "0 0 10px" }}>{cat} ({catItems.length})</p>
                {catItems.map(item => (
                  <div key={item.id} className="item-row">
                    <div>
                      <div style={{ fontWeight: "700", fontSize: "15px" }}>{item.hindiName || item.name}</div>
                      <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
                        MRP: ₹{item.mrp} · स्टॉक: {item.stock} {item.unit}
                        {item.brand && ` · ${item.brand}`}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                      {item.stock <= item.minStock && <span className="low-badge">कम</span>}
                      {item.expiry && new Date(item.expiry) < new Date(Date.now() + 30*24*60*60*1000) && (
                        <span style={{ background: "#fef3c7", color: "#d97706", fontSize: "11px", fontWeight: "600", padding: "2px 8px", borderRadius: "999px" }}>Expiry जल्दी</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}