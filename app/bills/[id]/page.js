export const dynamic = "force-dynamic";
import { requireAccess } from "@/lib/access";
import { db } from "@/lib/db";
import { bills, billItems, shopSettings, customers } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import ReceiptActions from "@/components/ReceiptActions";

export default async function ReceiptPage({ params }) {
  const { id } = await params;
  const session = await requireAccess();
  const billId = parseInt(id);
  if (!billId) redirect("/dashboard");

  const billRow = await db.select().from(bills)
    .where(and(eq(bills.id, billId), eq(bills.userId, session.userId))).limit(1);
  if (!billRow[0]) redirect("/dashboard");

  const bill = billRow[0];
  const itemsList = await db.select().from(billItems).where(eq(billItems.billId, billId));

  const settingsRow = await db.select().from(shopSettings).where(eq(shopSettings.userId, session.userId)).limit(1);
  const settings = settingsRow[0] || { shopName: "मेरी दुकान", ownerName: "", phone: "", address: "", gstin: "", upiId: "", thankYouMsg: "धन्यवाद! फिर आइएगा।" };

  let customerPhone = bill.customerPhone || "";
  if (bill.customerId) {
    const cust = await db.select().from(customers).where(eq(customers.id, bill.customerId)).limit(1);
    if (cust[0] && cust[0].phone) customerPhone = cust[0].phone;
  }

  const hasGst = !!settings.gstin && itemsList.some(i => (i.gst || 0) > 0);
  const totalGst = itemsList.reduce((s, i) => s + ((i.amount * (i.gst || 0)) / (100 + (i.gst || 0))), 0);
  const taxableAmount = bill.subtotal - totalGst;
  const balance = bill.total - bill.paid;

  const dateStr = new Date(bill.createdAt + "Z").toLocaleString("hi-IN", { dateStyle: "medium", timeStyle: "short" });

  return (
    <main style={{ minHeight: "100vh", background: "#f0fdf4", paddingBottom: "100px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Baloo 2', sans-serif; box-sizing: border-box; }
        .topbar { background: #14532d; color: #fff; padding: 12px 20px; display: flex; align-items: center; gap: 12px; position: sticky; top: 0; z-index: 50; }
        .receipt { background: #fff; max-width: 380px; margin: 16px auto; border-radius: 12px; padding: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
        .center { text-align: center; }
        .row { display: flex; justify-content: space-between; }
        .dashed { border-top: 1.5px dashed #9ca3af; margin: 10px 0; }
        .item-line { font-size: 13px; padding: 4px 0; }
        .gst-block { background: #f9fafb; border-radius: 8px; padding: 8px 12px; font-size: 12px; margin-top: 8px; }
        .actions-bar { position: fixed; bottom: 0; left: 0; right: 0; background: #fff; border-top: 1px solid #e5e7eb; padding: 12px; display: flex; gap: 8px; z-index: 60; }
        .btn { flex: 1; padding: 12px; border-radius: 12px; font-size: 14px; font-weight: 800; border: none; cursor: pointer; text-align: center; text-decoration: none; }
        .btn-print { background: #14532d; color: #fff; }
        .btn-wa { background: #16a34a; color: #fff; }
        .btn-new { background: #fff; color: #14532d; border: 2px solid #14532d; }
        @media print {
          body { background: #fff !important; }
          .topbar, .actions-bar, .no-print { display: none !important; }
          .receipt { box-shadow: none !important; max-width: 100% !important; margin: 0 !important; padding: 8px !important; border-radius: 0 !important; }
          @page { size: 80mm auto; margin: 4mm; }
        }
      `}</style>

      <div className="topbar no-print">
        <a href="/dashboard" style={{ color: "#fff", textDecoration: "none", fontSize: "20px" }}>←</a>
        <span style={{ fontSize: "18px", fontWeight: "800" }}>🧾 बिल {bill.billNo}</span>
      </div>

      <div className="receipt" id="receipt-print">
        <div className="center">
          <div style={{ fontSize: "20px", fontWeight: "900", color: "#14532d" }}>{settings.shopName || "मेरी दुकान"}</div>
          {settings.address && <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "2px" }}>{settings.address}</div>}
          {settings.phone && <div style={{ fontSize: "12px", color: "#6b7280" }}>📞 {settings.phone}</div>}
          {settings.gstin && <div style={{ fontSize: "12px", color: "#6b7280", fontWeight: "700" }}>GSTIN: {settings.gstin}</div>}
          {hasGst && <div style={{ fontSize: "11px", color: "#14532d", fontWeight: "700", marginTop: "4px", letterSpacing: "1px" }}>TAX INVOICE</div>}
        </div>

        <div className="dashed" />

        <div style={{ fontSize: "12px" }}>
          <div className="row"><span>बिल नं:</span><span style={{ fontWeight: "700" }}>{bill.billNo}</span></div>
          <div className="row"><span>दिनांक:</span><span>{dateStr}</span></div>
          <div className="row"><span>ग्राहक:</span><span style={{ fontWeight: "700" }}>{bill.customerName || "नकद ग्राहक"}</span></div>
          {customerPhone && <div className="row"><span>फोन:</span><span>{customerPhone}</span></div>}
        </div>

        <div className="dashed" />

        <div style={{ fontSize: "12px", fontWeight: "700", color: "#374151", display: "grid", gridTemplateColumns: "1.6fr 0.5fr 0.7fr 0.7fr", gap: "4px", paddingBottom: "4px", borderBottom: "1px solid #e5e7eb" }}>
          <span>सामान</span>
          <span style={{ textAlign: "center" }}>मात्रा</span>
          <span style={{ textAlign: "right" }}>दर</span>
          <span style={{ textAlign: "right" }}>रकम</span>
        </div>
        {itemsList.map((it, idx) => (
          <div key={idx} className="item-line" style={{ display: "grid", gridTemplateColumns: "1.6fr 0.5fr 0.7fr 0.7fr", gap: "4px", borderBottom: "1px dotted #f3f4f6" }}>
            <span>{it.itemName}</span>
            <span style={{ textAlign: "center" }}>{it.qty}{it.unit ? ` ${it.unit}` : ""}</span>
            <span style={{ textAlign: "right" }}>₹{it.mrp}</span>
            <span style={{ textAlign: "right", fontWeight: "700" }}>₹{it.amount.toLocaleString("hi-IN")}</span>
          </div>
        ))}

        <div className="dashed" />

        <div style={{ fontSize: "13px" }}>
          <div className="row"><span>कुल सामान</span><span>₹{bill.subtotal.toLocaleString("hi-IN")}</span></div>
          {bill.discount > 0 && <div className="row" style={{ color: "#16a34a" }}><span>छूट</span><span>−₹{bill.discount.toLocaleString("hi-IN")}</span></div>}
          {hasGst && (
            <div className="gst-block">
              <div className="row"><span>Taxable Amount</span><span>₹{taxableAmount.toFixed(2)}</span></div>
              <div className="row"><span>CGST</span><span>₹{(totalGst / 2).toFixed(2)}</span></div>
              <div className="row"><span>SGST</span><span>₹{(totalGst / 2).toFixed(2)}</span></div>
            </div>
          )}
          <div className="row" style={{ fontSize: "18px", fontWeight: "900", color: "#14532d", marginTop: "8px", paddingTop: "8px", borderTop: "1.5px solid #14532d" }}>
            <span>कुल</span><span>₹{bill.total.toLocaleString("hi-IN")}</span>
          </div>
          <div className="row" style={{ marginTop: "6px", color: "#6b7280" }}>
            <span>भुगतान — {bill.paymentMode === "cash" ? "नकद" : bill.paymentMode === "upi" ? "UPI" : "उधार"}</span>
            <span>₹{bill.paid.toLocaleString("hi-IN")}</span>
          </div>
          {balance > 0 && (
            <div className="row" style={{ color: "#dc2626", fontWeight: "800", marginTop: "4px" }}>
              <span>उधार बाकी</span><span>₹{balance.toLocaleString("hi-IN")}</span>
            </div>
          )}
        </div>

        {settings.upiId && balance > 0 && (
          <>
            <div className="dashed" />
            <div className="center">
              <div style={{ fontSize: "12px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>UPI से Pay करो</div>
              <UpiQR upiId={settings.upiId} name={settings.shopName || "Shop"} amount={balance} note={`Bill ${bill.billNo}`} />
              <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "6px" }}>{settings.upiId}</div>
            </div>
          </>
        )}

        <div className="dashed" />

        <div className="center" style={{ fontSize: "12px", color: "#6b7280" }}>
          {settings.thankYouMsg || "धन्यवाद! फिर आइएगा।"}
        </div>
      </div>

      <ReceiptActions
        billNo={bill.billNo}
        shopName={settings.shopName || "मेरी दुकान"}
        customerName={bill.customerName || "ग्राहक"}
        customerPhone={customerPhone}
        total={bill.total}
        paid={bill.paid}
        balance={balance}
        items={itemsList.map(i => ({ name: i.itemName, qty: i.qty, unit: i.unit || "", amount: i.amount }))}
        upiLink={settings.upiId ? buildUpiLink(settings.upiId, settings.shopName || "Shop", balance > 0 ? balance : bill.total, `Bill ${bill.billNo}`) : null}
      />
    </main>
  );
}

function UpiQR({ upiId, name, amount, note }) {
  const link = buildUpiLink(upiId, name, amount, note);
  const qrApi = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(link)}`;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={qrApi} alt="UPI QR" width="180" height="180" style={{ borderRadius: "8px" }} />
  );
}

function buildUpiLink(upiId, name, amount, note) {
  const params = new URLSearchParams({ pa: upiId, pn: name, am: amount.toFixed(2), cu: "INR", tn: note });
  return `upi://pay?${params.toString()}`;
}