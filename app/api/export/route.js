import { db } from "@/lib/db";
import { bills, items, customers, udharLedger, billItems } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/session";

export async function GET(request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "bills";

  let rows = [];
  let headers = [];
  let filename = "export.csv";

  if (type === "items") {
    const data = await db.select().from(items).where(eq(items.userId, session.userId));
    headers = ["ID", "नाम", "हिंदी नाम", "कैटेगरी", "Brand", "Unit", "MRP", "खरीद भाव", "स्टॉक", "GST%", "HSN", "Barcode", "Expiry"];
    rows = data.map(i => [i.id, i.name, i.hindiName || "", i.category, i.brand || "", i.unit || "", i.mrp, i.purchasePrice || "", i.stock, i.gst || 0, i.hsn || "", i.barcode || "", i.expiry || ""]);
    filename = `items-${today()}.csv`;
  } else if (type === "customers") {
    const data = await db.select().from(customers).where(eq(customers.userId, session.userId));
    headers = ["ID", "नाम", "Phone", "पता", "उधार", "जुड़े"];
    rows = data.map(c => [c.id, c.name, c.phone || "", c.address || "", c.udhar || 0, c.createdAt || ""]);
    filename = `customers-${today()}.csv`;
  } else if (type === "udhar") {
    const data = await db.select().from(udharLedger).where(eq(udharLedger.userId, session.userId));
    const cs = await db.select().from(customers).where(eq(customers.userId, session.userId));
    const map = new Map(cs.map(c => [c.id, c.name]));
    headers = ["ID", "ग्राहक", "प्रकार", "रकम", "नोट", "तारीख"];
    rows = data.map(l => [l.id, map.get(l.customerId) || "", l.type === "debit" ? "उधार" : "जमा", l.amount, l.note || "", l.createdAt || ""]);
    filename = `udhar-${today()}.csv`;
  } else if (type === "bills-detailed") {
    const data = await db.select().from(bills).where(eq(bills.userId, session.userId));
    const billIds = data.map(b => b.id);
    const itemsRaw = billIds.length ? await db.select().from(billItems) : [];
    const itemsByBill = new Map();
    for (const it of itemsRaw) {
      if (!billIds.includes(it.billId)) continue;
      const arr = itemsByBill.get(it.billId) || [];
      arr.push(it);
      itemsByBill.set(it.billId, arr);
    }
    headers = ["बिल नं", "तारीख", "ग्राहक", "Phone", "सामान", "मात्रा", "दर", "रकम", "बिल कुल", "भुगतान", "बकाया", "तरीका"];
    for (const b of data) {
      const list = itemsByBill.get(b.id) || [];
      if (list.length === 0) {
        rows.push([b.billNo, b.createdAt, b.customerName || "", b.customerPhone || "", "", "", "", "", b.total, b.paid, b.total - b.paid, b.paymentMode]);
      } else {
        for (const it of list) {
          rows.push([b.billNo, b.createdAt, b.customerName || "", b.customerPhone || "", it.itemName, it.qty, it.mrp, it.amount, b.total, b.paid, b.total - b.paid, b.paymentMode]);
        }
      }
    }
    filename = `bills-detailed-${today()}.csv`;
  } else {
    const data = await db.select().from(bills).where(eq(bills.userId, session.userId));
    headers = ["बिल नं", "तारीख", "ग्राहक", "Phone", "Subtotal", "Discount", "कुल", "भुगतान", "बकाया", "तरीका"];
    rows = data.map(b => [b.billNo, b.createdAt, b.customerName || "", b.customerPhone || "", b.subtotal, b.discount || 0, b.total, b.paid, b.total - b.paid, b.paymentMode]);
    filename = `bills-${today()}.csv`;
  }

  const csv = toCSV(headers, rows);
  const bom = "\uFEFF";
  return new Response(bom + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

function toCSV(headers, rows) {
  const esc = (v) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  const lines = [headers.map(esc).join(",")];
  for (const r of rows) lines.push(r.map(esc).join(","));
  return lines.join("\n");
}

function today() {
  return new Date().toISOString().slice(0, 10);
}