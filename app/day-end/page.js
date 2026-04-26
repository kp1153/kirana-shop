export const dynamic = "force-dynamic";
import { requireAccess } from "@/lib/access";
import { db } from "@/lib/db";
import { bills, udharLedger, shopSettings, purchases } from "@/lib/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import PrintButton from "@/components/PrintButton";

export default async function DayEndPage({ searchParams }) {
  const session = await requireAccess();
  const sp = await searchParams;
  const dateStr = sp?.date || new Date().toISOString().slice(0, 10);

  const startISO = `${dateStr} 00:00:00`;
  const endISO = `${dateStr} 23:59:59`;

  const todayBills = await db.select().from(bills)
    .where(and(eq(bills.userId, session.userId), gte(bills.createdAt, startISO), lte(bills.createdAt, endISO)));

  const todayLedger = await db.select().from(udharLedger)
    .where(and(eq(udharLedger.userId, session.userId), gte(udharLedger.createdAt, startISO), lte(udharLedger.createdAt, endISO)));

  const todayPurchases = await db.select().from(purchases)
    .where(and(eq(purchases.userId, session.userId), gte(purchases.createdAt, startISO), lte(purchases.createdAt, endISO)));

  const settingsRow = await db.select().from(shopSettings).where(eq(shopSettings.userId, session.userId)).limit(1);
  const settings = settingsRow[0] || { shopName: "मेरी दुकान" };

  let cashIn = 0, upiIn = 0, creditGiven = 0, creditReceived = 0;
  let cashBills = 0, upiBills = 0, creditBills = 0;
  let totalSales = 0;

  for (const b of todayBills) {
    totalSales += b.total || 0;
    const paid = b.paid || 0;
    const bal = (b.total || 0) - paid;
    if (b.paymentMode === "cash") { cashIn += paid; cashBills++; }
    else if (b.paymentMode === "upi") { upiIn += paid; upiBills++; }
    else if (b.paymentMode === "credit") { creditBills++; }
    if (bal > 0) creditGiven += bal;
  }

  for (const l of todayLedger) {
    if (l.type === "credit") creditReceived += l.amount || 0;
  }

  const totalPurchaseSpend = todayPurchases.reduce((s, p) => s + (p.paid || 0), 0);

  const dateDisplay = new Date(dateStr).toLocaleDateString("hi-IN", { dateStyle: "full" });

  return (
    <main style={{ minHeight: "100vh", background: "#f0fdf4", paddingBottom: "80px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;600;700;800&display=swap');
        * { font-family: 'Baloo 2', sans-serif; box-sizing: border-box; }
        .topbar { background: #14532d; color: #fff; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
        .card { background: #fff; border-radius: 14px; padding: 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); margin-bottom: 12px; }
        .row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; }
        .row-bord { border-top: 1px dashed #e5e7eb; }
        .lbl { font-size: 14px; color: #374151; }
        .val { font-weight: 800; }
        .green { color: #16a34a; }
        .red { color: #dc2626; }
        .dark { color: #14532d; }
        .print-btn { background: #14532d; color: #fff; padding: 14px; border-radius: 14px; font-size: 16px; font-weight: 800; border: none; cursor: pointer; width: 100%; }
        .date-input { padding: 8px 12px; border-radius: 10px; border: 1.5px solid #d1d5db; font-size: 14px; }
        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; }
          .card { box-shadow: none !important; border: 1px solid #ccc; margin-bottom: 12px !important; }
        }
      `}</style>

      <div className="topbar no-print">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <a href="/dashboard" style={{ color: "#fff", textDecoration: "none", fontSize: "20px" }}>←</a>
          <span style={{ fontSize: "18px", fontWeight: "800" }}>🔒 दिन का हिसाब</span>
        </div>
        <form method="get" style={{ display: "flex", gap: "6px" }}>
          <input type="date" name="date" defaultValue={dateStr} className="date-input" />
          <button type="submit" style={{ background: "#fff", color: "#14532d", border: "none", borderRadius: "10px", padding: "0 12px", fontWeight: "700", cursor: "pointer" }}>देखो</button>
        </form>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "16px" }}>
        <div className="card" style={{ background: "#14532d", color: "#fff", textAlign: "center" }}>
          <div style={{ fontSize: "22px", fontWeight: "800" }}>{settings.shopName}</div>
          <div style={{ fontSize: "13px", opacity: 0.85, marginTop: "4px" }}>{dateDisplay}</div>
          <div style={{ fontSize: "32px", fontWeight: "900", marginTop: "10px" }}>₹{totalSales.toLocaleString("hi-IN")}</div>
          <div style={{ fontSize: "12px", opacity: 0.85 }}>आज की कुल बिक्री ({todayBills.length} बिल)</div>
        </div>

        <div className="card">
          <p style={{ fontWeight: "800", fontSize: "16px", color: "#14532d", margin: "0 0 8px" }}>💰 पैसा कहाँ से आया</p>
          <div className="row">
            <span className="lbl">💵 नकद ({cashBills} बिल)</span>
            <span className="val green">+₹{cashIn.toLocaleString("hi-IN")}</span>
          </div>
          <div className="row row-bord">
            <span className="lbl">📱 UPI ({upiBills} बिल)</span>
            <span className="val green">+₹{upiIn.toLocaleString("hi-IN")}</span>
          </div>
          <div className="row row-bord">
            <span className="lbl">📒 उधार-वसूली</span>
            <span className="val green">+₹{creditReceived.toLocaleString("hi-IN")}</span>
          </div>
          <div className="row row-bord" style={{ paddingTop: "12px" }}>
            <span className="lbl" style={{ fontWeight: "700" }}>कुल आमदनी</span>
            <span className="val dark" style={{ fontSize: "18px" }}>₹{(cashIn + upiIn + creditReceived).toLocaleString("hi-IN")}</span>
          </div>
        </div>

        <div className="card">
          <p style={{ fontWeight: "800", fontSize: "16px", color: "#14532d", margin: "0 0 8px" }}>📤 खर्च और उधार</p>
          <div className="row">
            <span className="lbl">📦 आज की खरीद</span>
            <span className="val red">−₹{totalPurchaseSpend.toLocaleString("hi-IN")}</span>
          </div>
          <div className="row row-bord">
            <span className="lbl">📒 आज दिया उधार ({creditBills} बिल)</span>
            <span className="val red">₹{creditGiven.toLocaleString("hi-IN")}</span>
          </div>
        </div>

        <div className="card" style={{ background: "#dcfce7", border: "2px solid #16a34a" }}>
          <div className="row">
            <span className="lbl" style={{ fontSize: "16px", fontWeight: "800", color: "#14532d" }}>📊 आज शुद्ध कैश</span>
            <span style={{ fontSize: "22px", fontWeight: "900", color: "#14532d" }}>
              ₹{(cashIn + upiIn + creditReceived - totalPurchaseSpend).toLocaleString("hi-IN")}
            </span>
          </div>
          <div style={{ fontSize: "12px", color: "#374151", marginTop: "4px" }}>
            (नकद + UPI + उधार-वसूली) − खरीद का खर्च
          </div>
        </div>

        <PrintButton label="🖨️ इस हिसाब को print करो" />
      </div>
    </main>
  );
}