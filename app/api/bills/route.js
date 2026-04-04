import { db } from "@/lib/db";
import { bills, billItems, items, customers, udharLedger } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/session";

export async function GET(request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  const allBills = await db.select().from(bills).where(eq(bills.userId, session.userId));
  const filtered = date ? allBills.filter(b => b.createdAt.startsWith(date)) : allBills;

  return Response.json({ bills: filtered });
}

export async function POST(request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { customerId, customerName, customerPhone, items: cartItems, discount, paymentMode, paid } = body;

  if (!cartItems || cartItems.length === 0) {
    return Response.json({ error: "कोई सामान नहीं है" }, { status: 400 });
  }

  const subtotal = cartItems.reduce((s, i) => s + i.amount, 0);
  const gstAmount = cartItems.reduce((s, i) => s + (i.amount * (i.gst || 0) / 100), 0);
  const total = subtotal - (discount || 0) + gstAmount;
  const paidAmount = paid || 0;

  const billNo = "BILL-" + Date.now();

  const insertedBill = await db.insert(bills).values({
    userId: session.userId,
    customerId: customerId || null,
    customerName: customerName || "नकद ग्राहक",
    customerPhone: customerPhone || null,
    billNo,
    subtotal,
    discount: discount || 0,
    gstAmount,
    total,
    paid: paidAmount,
    paymentMode: paymentMode || "cash",
  }).returning();

  const billId = insertedBill[0].id;

  for (const item of cartItems) {
    await db.insert(billItems).values({
      billId,
      itemId: item.itemId || null,
      itemName: item.name,
      unit: item.unit || "",
      qty: item.qty,
      mrp: item.mrp,
      discount: item.discount || 0,
      gst: item.gst || 0,
      amount: item.amount,
    });

    if (item.itemId) {
      const existing = await db.select().from(items).where(eq(items.id, item.itemId)).limit(1);
      if (existing[0]) {
        await db.update(items).set({ stock: Math.max(0, (existing[0].stock || 0) - item.qty) })
          .where(eq(items.id, item.itemId));
      }
    }
  }

  if (customerId && paidAmount < total) {
    const udharAmount = total - paidAmount;
    await db.insert(udharLedger).values({
      userId: session.userId,
      customerId,
      billId,
      type: "debit",
      amount: udharAmount,
      note: `Bill ${billNo}`,
    });

    const cust = await db.select().from(customers).where(eq(customers.id, customerId)).limit(1);
    if (cust[0]) {
      await db.update(customers).set({ udhar: (cust[0].udhar || 0) + udharAmount })
        .where(eq(customers.id, customerId));
    }
  }

  return Response.json({ bill: insertedBill[0] });
}