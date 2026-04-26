export const dynamic = "force-dynamic";
import { requireAccess } from "@/lib/access";
import { db } from "@/lib/db";
import { bills, items, customers } from "@/lib/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function Dashboard() {
  const session = await requireAccess();
  const userId = session.userId;

  const allBills = await db.select().from(bills).where(eq(bills.userId, userId));
  const allItems = await db.select().from(items).where(eq(items.userId, userId));
  const allCustomers = await db.select().from(customers).where(eq(customers.userId, userId));

  const today = new Date().toISOString().split("T")[0];
  const todayBills = allBills.filter(b => b.createdAt.startsWith(today));
  const todaySale = todayBills.reduce((s, b) => s + b.total, 0);
  const todayCollection = todayBills.reduce((s, b) => s + b.paid, 0);

  const lowStock = allItems.filter(i => i.active && i.stock <= i.minStock);
  const totalUdhar = allCustomers.reduce((s, c) => s + (c.udhar || 0), 0);

  const monthBills = allBills.filter(b => b.createdAt.startsWith(new Date().toISOString().slice(0, 7)));
  const monthSale = monthBills.reduce((s, b) => s + b.total, 0);

  return (
    <main style={{ minHeight: "100vh", background: "#f0fdf4", paddingBottom: "72px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Baloo 2', sans-serif; box-sizing: border-box; }
        .topbar { background: #14532d; color: #fff; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
        .stat-card { background: #fff; border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        .stat-val { font-size: 28px; font-weight: 800; color: #14532d; }
        .stat-label { font-size: 14px; color: #6b7280; margin-top: 2px; }
        .nav-btn { display: flex; flex-direction: column; align-items: center; gap: 6px; background: #fff; border-radius: 16px; padding: 20px 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); text-decoration: none; color: #14532d; font-weight: 700; font-size: 13px; transition: all 0.2s; }
        .nav-btn:hover { background: #dcfce7; transform: translateY(-2px); }
        .nav-icon { font-size: 32px; }
        .section-title { font-size: 18px; font-weight: 700; color: #14532d; margin: 0 0 12px; }
        .alert-card { background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 14px 16px; display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
        .bill-row { background: #fff; border-radius: 12px; padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
        .bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; background: #14532d; display: flex; justify-content: space-around; align-items: center; padding: 8px 0; z-index: 50; }
        .bnav-btn { display: flex; flex-direction: column; align-items: center; gap: 2px; color: #fff; text-decoration: none; font-size: 11px; font-weight: 700; opacity: 0.75; }
        .bnav-btn.active { opacity: 1; }
        .bnav-icon { font-size: 22px; }
      `}</style>

      <div className="topbar">
        <div>
          <div style={{ fontSize: "18px", fontWeight: "800" }}>🛒 Ration Pro</div>
          <div style={{ fontSize: "12px", opacity: 0.8 }}>{session.name}</div>
        </div>
        <LogoutButton />
      </div>

      <div style={{ padding: "16px", maxWidth: "600px", margin: "0 auto" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
          <div className="stat-card">
            <div className="stat-val">₹{todaySale.toLocaleString("hi-IN")}</div>
            <div className="stat-label">आज की बिक्री</div>
          </div>
          <div className="stat-card">
            <div className="stat-val">₹{todayCollection.toLocaleString("hi-IN")}</div>
            <div className="stat-label">आज मिले पैसे</div>
          </div>
          <div className="stat-card">
            <div className="stat-val" style={{ color: totalUdhar > 0 ? "#dc2626" : "#14532d" }}>₹{totalUdhar.toLocaleString("hi-IN")}</div>
            <div className="stat-label">कुल उधारी</div>
          </div>
          <div className="stat-card">
            <div className="stat-val">₹{monthSale.toLocaleString("hi-IN")}</div>
            <div className="stat-label">इस महीने</div>
          </div>
        </div>

        {/* Quick Nav — grid-cols-2 mobile, grid-cols-4 desktop */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", marginBottom: "12px" }}>
          <Link href="/billing" className="nav-btn"><span className="nav-icon">🧾</span>बिल बनाओ</Link>
          <Link href="/items" className="nav-btn"><span className="nav-icon">📦</span>सामान</Link>
          <Link href="/customers" className="nav-btn"><span className="nav-icon">👥</span>ग्राहक</Link>
          <Link href="/reports" className="nav-btn"><span className="nav-icon">📊</span>रिपोर्ट</Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", marginBottom: "24px" }}>
          <Link href="/purchase" className="nav-btn"><span className="nav-icon">🚚</span>खरीद</Link>
          <Link href="/udhar" className="nav-btn"><span className="nav-icon">💰</span>उधारी</Link>
          <Link href="/day-end" className="nav-btn"><span className="nav-icon">🔒</span>दिन का हिसाब</Link>
          <Link href="/settings" className="nav-btn"><span className="nav-icon">⚙️</span>Settings</Link>
        </div>

        {/* Low Stock Alert */}
        {lowStock.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <p className="section-title">⚠️ कम स्टॉक ({lowStock.length} सामान)</p>
            {lowStock.slice(0, 5).map(item => (
              <div key={item.id} className="alert-card">
                <span style={{ fontSize: "20px" }}>📦</span>
                <div>
                  <div style={{ fontWeight: "700", fontSize: "15px", color: "#991b1b" }}>{item.hindiName || item.name}</div>
                  <div style={{ fontSize: "13px", color: "#6b7280" }}>बचा: {item.stock} {item.unit} · न्यूनतम: {item.minStock}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Today's Bills */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <p className="section-title" style={{ margin: 0 }}>📋 आज के बिल ({todayBills.length})</p>
            <Link href="/billing" style={{ background: "#16a34a", color: "#fff", padding: "8px 16px", borderRadius: "10px", textDecoration: "none", fontSize: "14px", fontWeight: "700" }}>+ नया बिल</Link>
          </div>
          {todayBills.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: "16px", padding: "32px", textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "8px" }}>🧾</div>
              <p style={{ color: "#6b7280", fontSize: "15px" }}>आज अभी कोई बिल नहीं बना</p>
              <Link href="/billing" style={{ display: "inline-block", marginTop: "12px", background: "#16a34a", color: "#fff", padding: "10px 24px", borderRadius: "12px", textDecoration: "none", fontWeight: "700" }}>पहला बिल बनाओ</Link>
            </div>
          ) : (
            todayBills.slice(0, 10).map(b => (
              <Link key={b.id} href={`/bills/${b.id}`} className="bill-row" style={{ textDecoration: "none", color: "inherit" }}>
                <div>
                  <div style={{ fontWeight: "700", fontSize: "15px" }}>{b.customerName}</div>
                  <div style={{ fontSize: "13px", color: "#6b7280" }}>{b.billNo} · {b.paymentMode === "cash" ? "नकद" : b.paymentMode === "upi" ? "UPI" : "उधार"}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: "800", fontSize: "16px", color: "#14532d" }}>₹{b.total.toLocaleString("hi-IN")}</div>
                  {b.paid < b.total && <div style={{ fontSize: "12px", color: "#dc2626" }}>उधार: ₹{(b.total - b.paid).toLocaleString("hi-IN")}</div>}
                </div>
              </Link>
            ))
          )}
        </div>

      </div>

      {/* Bottom Nav */}
      <nav className="bottom-nav">
        <Link href="/dashboard" className="bnav-btn active"><span className="bnav-icon">🏠</span>होम</Link>
        <Link href="/billing" className="bnav-btn"><span className="bnav-icon">🧾</span>बिल</Link>
        <Link href="/items" className="bnav-btn"><span className="bnav-icon">📦</span>सामान</Link>
        <Link href="/udhar" className="bnav-btn"><span className="bnav-icon">💰</span>उधारी</Link>
        <Link href="/settings" className="bnav-btn"><span className="bnav-icon">⚙️</span>Settings</Link>
      </nav>

    </main>
  );
}