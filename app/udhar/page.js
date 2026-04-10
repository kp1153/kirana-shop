export const dynamic = "force-dynamic";
import { requireAccess } from "@/lib/access";
import { db } from "@/lib/db";
import { customers } from "@/lib/schema";
import { eq, gt } from "drizzle-orm";
import UdharPayForm from "@/components/UdharPayForm";

export default async function UdharPage() {
  const session = await requireAccess();
  const all = await db.select().from(customers).where(eq(customers.userId, session.userId));
  const udharCustomers = all.filter(c => c.udhar > 0);
  const total = udharCustomers.reduce((s, c) => s + c.udhar, 0);

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
        <span style={{ fontSize: "18px", fontWeight: "800" }}>💰 उधारी</span>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "16px" }}>
        <div style={{ background: "#dc2626", borderRadius: "16px", padding: "20px", marginBottom: "16px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><div style={{ fontSize: "14px", opacity: 0.9 }}>कुल बकाया</div><div style={{ fontSize: "32px", fontWeight: "800" }}>₹{total.toLocaleString("hi-IN")}</div></div>
          <div style={{ fontSize: "48px" }}>📒</div>
        </div>

        {udharCustomers.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: "16px", padding: "48px", textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "8px" }}>✅</div>
            <p style={{ color: "#16a34a", fontWeight: "700", fontSize: "16px" }}>सब साफ है! कोई उधारी नहीं।</p>
          </div>
        ) : (
          udharCustomers.map(c => (
            <div key={c.id} style={{ background: "#fff", borderRadius: "14px", padding: "16px", marginBottom: "10px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <div>
                  <div style={{ fontWeight: "800", fontSize: "17px" }}>{c.name}</div>
                  <div style={{ fontSize: "13px", color: "#6b7280" }}>{c.phone || "नंबर नहीं"}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: "800", fontSize: "20px", color: "#dc2626" }}>₹{c.udhar.toLocaleString("hi-IN")}</div>
                  {c.phone && (
                    <a href={`https://wa.me/91${c.phone}?text=नमस्ते ${c.name} जी, आपका ₹${c.udhar} उधार बाकी है। कृपया जल्दी दें।`}
                      target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: "12px", background: "#25d366", color: "#fff", padding: "4px 10px", borderRadius: "8px", textDecoration: "none", fontWeight: "600" }}>
                      💬 Reminder
                    </a>
                  )}
                </div>
              </div>
              <UdharPayForm customerId={c.id} customerName={c.name} />
            </div>
          ))
        )}
      </div>

      <nav className="bottom-nav">
        <a href="/dashboard" className="bnav-btn"><span className="bnav-icon">🏠</span>होम</a>
        <a href="/billing" className="bnav-btn"><span className="bnav-icon">🧾</span>बिल</a>
        <a href="/items" className="bnav-btn"><span className="bnav-icon">📦</span>सामान</a>
        <a href="/udhar" className="bnav-btn active"><span className="bnav-icon">💰</span>उधारी</a>
        <a href="/settings" className="bnav-btn"><span className="bnav-icon">⚙️</span>Settings</a>
      </nav>

    </main>
  );
}