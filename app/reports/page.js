export const dynamic = "force-dynamic";
import { requireAccess } from "@/lib/access";
import { db } from "@/lib/db";
import { bills, billItems, items } from "@/lib/schema";
import { eq } from "drizzle-orm";

export default async function ReportsPage() {
  const session = await requireAccess();
  const userId = session.userId;

  const allBills = await db.select().from(bills).where(eq(bills.userId, userId));

  const today = new Date().toISOString().split("T")[0];
  const thisMonth = new Date().toISOString().slice(0, 7);

  const todayBills = allBills.filter(b => b.createdAt.startsWith(today));
  const monthBills = allBills.filter(b => b.createdAt.startsWith(thisMonth));

  const todaySale = todayBills.reduce((s, b) => s + b.total, 0);
  const todayPaid = todayBills.reduce((s, b) => s + b.paid, 0);
  const monthSale = monthBills.reduce((s, b) => s + b.total, 0);
  const monthPaid = monthBills.reduce((s, b) => s + b.paid, 0);
  const totalSale = allBills.reduce((s, b) => s + b.total, 0);

  const last7 = Array.from({length: 7}, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - i);
    const ds = d.toISOString().split("T")[0];
    const dayBills = allBills.filter(b => b.createdAt.startsWith(ds));
    return { date: ds, sale: dayBills.reduce((s, b) => s + b.total, 0), count: dayBills.length };
  }).reverse();

  const maxSale = Math.max(...last7.map(d => d.sale), 1);

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
        <span style={{ fontSize: "18px", fontWeight: "800" }}>📊 रिपोर्ट</span>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "16px" }}>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
          {[
            { label: "आज बिक्री", val: todaySale, sub: `${todayBills.length} बिल` },
            { label: "आज मिले", val: todayPaid, sub: `₹${(todaySale - todayPaid).toLocaleString("hi-IN")} उधार` },
            { label: "इस महीने", val: monthSale, sub: `${monthBills.length} बिल` },
            { label: "कुल बिक्री", val: totalSale, sub: `${allBills.length} बिल` },
          ].map((s, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: "16px", padding: "18px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: "24px", fontWeight: "800", color: "#14532d" }}>₹{s.val.toLocaleString("hi-IN")}</div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#374151" }}>{s.label}</div>
              <div style={{ fontSize: "12px", color: "#9ca3af" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", marginBottom: "20px" }}>
          <p style={{ fontWeight: "800", fontSize: "16px", color: "#14532d", margin: "0 0 16px" }}>📈 पिछले 7 दिन</p>
          <div style={{ display: "flex", gap: "8px", alignItems: "flex-end", height: "120px" }}>
            {last7.map((d, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <div style={{ fontSize: "10px", color: "#6b7280", fontWeight: "600" }}>₹{(d.sale/1000).toFixed(1)}k</div>
                <div style={{ width: "100%", background: d.date === today ? "#16a34a" : "#bbf7d0", borderRadius: "6px 6px 0 0", height: `${(d.sale / maxSale) * 80}px`, minHeight: "4px" }} />
                <div style={{ fontSize: "10px", color: "#6b7280" }}>{d.date.slice(8)}/{d.date.slice(5, 7)}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: "16px", padding: "20px" }}>
          <p style={{ fontWeight: "800", fontSize: "16px", color: "#14532d", margin: "0 0 14px" }}>🧾 हाल के बिल</p>
          {allBills.slice(-10).reverse().map(b => (
            <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
              <div>
                <div style={{ fontWeight: "700", fontSize: "14px" }}>{b.customerName}</div>
                <div style={{ fontSize: "12px", color: "#9ca3af" }}>{b.createdAt.slice(0, 10)}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: "800", color: "#14532d" }}>₹{b.total.toLocaleString("hi-IN")}</div>
                <div style={{ fontSize: "11px", color: b.paid < b.total ? "#dc2626" : "#16a34a" }}>
                  {b.paid < b.total ? `उधार ₹${(b.total - b.paid).toLocaleString("hi-IN")}` : "पूरा मिला"}
                </div>
              </div>
            </div>
          ))}
        </div>

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