export const dynamic = "force-dynamic";
import { requireAccess } from "@/lib/access";
import { db } from "@/lib/db";
import { customers, bills, billItems, udharLedger } from "@/lib/schema";
import { eq, and, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function CustomerDetailPage({ params }) {
  const { id } = await params;
  const session = await requireAccess();
  const cId = parseInt(id);
  if (!cId) redirect("/customers");

  const row = await db.select().from(customers)
    .where(and(eq(customers.id, cId), eq(customers.userId, session.userId))).limit(1);
  if (!row[0]) redirect("/customers");
  const customer = row[0];

  const allBills = await db.select().from(bills)
    .where(and(eq(bills.userId, session.userId), eq(bills.customerId, cId)))
    .orderBy(desc(bills.createdAt));

  const ledger = await db.select().from(udharLedger)
    .where(and(eq(udharLedger.userId, session.userId), eq(udharLedger.customerId, cId)))
    .orderBy(desc(udharLedger.createdAt));

  const totalSpent = allBills.reduce((s, b) => s + (b.total || 0), 0);
  const totalBills = allBills.length;
  const lastVisit = allBills[0] ? new Date(allBills[0].createdAt + "Z").toLocaleDateString("hi-IN", { dateStyle: "medium" }) : "—";

  let phoneClean = (customer.phone || "").replace(/\D/g, "");
  if (phoneClean.length === 10) phoneClean = "91" + phoneClean;
  const waLink = phoneClean ? `https://wa.me/${phoneClean}?text=${encodeURIComponent(`नमस्ते ${customer.name} जी, आपका ₹${customer.udhar || 0} उधार बाकी है।`)}` : null;

  return (
    <main style={{ minHeight: "100vh", background: "#f0fdf4", paddingBottom: "80px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700;800&display=swap');
        * { font-family: 'Baloo 2', sans-serif; box-sizing: border-box; }
        .topbar { background: #14532d; color: #fff; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
        .stat-card { background: #fff; border-radius: 14px; padding: 14px 12px; text-align: center; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
        .stat-num { font-size: 22px; font-weight: 800; color: #14532d; }
        .stat-lbl { font-size: 11px; color: #6b7280; margin-top: 2px; }
        .bill-card { background: #fff; border-radius: 12px; padding: 14px; margin-bottom: 8px; display: block; text-decoration: none; color: inherit; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
        .led-row { background: #fff; border-radius: 10px; padding: 10px 14px; margin-bottom: 6px; display: flex; justify-content: space-between; font-size: 13px; }
      `}</style>

      <div className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <a href="/customers" style={{ color: "#fff", textDecoration: "none", fontSize: "20px" }}>←</a>
          <span style={{ fontSize: "18px", fontWeight: "800" }}>👤 {customer.name}</span>
        </div>
        {waLink && (
          <a href={waLink} target="_blank" rel="noopener noreferrer" style={{ background: "#16a34a", color: "#fff", padding: "6px 12px", borderRadius: "10px", textDecoration: "none", fontSize: "13px", fontWeight: "700" }}>💬 WhatsApp</a>
        )}
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "16px" }}>

        <div style={{ background: "#fff", borderRadius: "14px", padding: "14px 16px", marginBottom: "14px" }}>
          <div style={{ fontSize: "13px", color: "#6b7280" }}>📞 {customer.phone || "नंबर नहीं"}</div>
          {customer.address && <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "2px" }}>📍 {customer.address}</div>}
          {(customer.udhar || 0) > 0 && (
            <div style={{ marginTop: "10px", padding: "10px 14px", background: "#fef2f2", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: "700", color: "#dc2626" }}>उधार बाकी</span>
              <span style={{ fontWeight: "800", color: "#dc2626", fontSize: "20px" }}>₹{customer.udhar.toLocaleString("hi-IN")}</span>
            </div>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "16px" }}>
          <div className="stat-card">
            <div className="stat-num">{totalBills}</div>
            <div className="stat-lbl">कुल बिल</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">₹{totalSpent.toLocaleString("hi-IN")}</div>
            <div className="stat-lbl">कुल खर्च</div>
          </div>
          <div className="stat-card">
            <div className="stat-num" style={{ fontSize: "13px", lineHeight: "1.3", paddingTop: "4px" }}>{lastVisit}</div>
            <div className="stat-lbl">पिछला आना</div>
          </div>
        </div>

        <div>
          <p style={{ fontWeight: "700", fontSize: "16px", color: "#14532d", margin: "0 0 10px" }}>🧾 पुराने बिल ({allBills.length})</p>
          {allBills.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: "14px", padding: "32px", textAlign: "center", color: "#6b7280" }}>अभी कोई बिल नहीं बना</div>
          ) : (
            allBills.map(b => {
              const bal = b.total - b.paid;
              return (
                <Link key={b.id} href={`/bills/${b.id}`} className="bill-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: "800", fontSize: "15px" }}>{b.billNo}</div>
                      <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>
                        {new Date(b.createdAt + "Z").toLocaleString("hi-IN", { dateStyle: "medium", timeStyle: "short" })}
                      </div>
                      <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>
                        {b.paymentMode === "cash" ? "💵 नकद" : b.paymentMode === "upi" ? "📱 UPI" : "📒 उधार"}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: "800", fontSize: "16px", color: "#14532d" }}>₹{b.total.toLocaleString("hi-IN")}</div>
                      {bal > 0 && <div style={{ fontSize: "11px", color: "#dc2626", fontWeight: "700" }}>उधार: ₹{bal.toLocaleString("hi-IN")}</div>}
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {ledger.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <p style={{ fontWeight: "700", fontSize: "16px", color: "#14532d", margin: "0 0 10px" }}>💰 उधार-जमा का हिसाब</p>
            {ledger.map(l => (
              <div key={l.id} className="led-row">
                <div>
                  <span style={{ fontWeight: "700", color: l.type === "debit" ? "#dc2626" : "#16a34a" }}>
                    {l.type === "debit" ? "उधार लिया" : "जमा किया"}
                  </span>
                  <div style={{ fontSize: "11px", color: "#6b7280" }}>
                    {new Date(l.createdAt + "Z").toLocaleDateString("hi-IN")}
                    {l.note ? ` · ${l.note}` : ""}
                  </div>
                </div>
                <span style={{ fontWeight: "800", color: l.type === "debit" ? "#dc2626" : "#16a34a" }}>
                  ₹{l.amount.toLocaleString("hi-IN")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}