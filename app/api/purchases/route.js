import { db } from "@/lib/db";
import { purchases, purchaseItems, items } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const all = await db.select().from(purchases).where(eq(purchases.userId, session.userId));
  return Response.json({ purchases: all });
}

export async function POST(request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { supplierName, invoiceNo, items: purchasedItems, paid } = body;

  if (!purchasedItems || purchasedItems.length === 0) {
    return Response.json({ error: "कोई सामान नहीं" }, { status: 400 });
  }

  const total = purchasedItems.reduce((s, i) => s + i.amount, 0);

  const inserted = await db.insert(purchases).values({
    userId: session.userId,
    supplierName: supplierName || null,
    invoiceNo: invoiceNo || null,
    total,
    paid: paid || 0,
  }).returning();

  const purchaseId = inserted[0].id;

  for (const item of purchasedItems) {
    await db.insert(purchaseItems).values({
      purchaseId,
      itemId: item.itemId || null,
      itemName: item.name,
      qty: item.qty,
      purchasePrice: item.purchasePrice,
      mrp: item.mrp || 0,
      expiry: item.expiry || null,
      amount: item.amount,
    });

    if (item.itemId) {
      const existing = await db.select().from(items).where(eq(items.id, item.itemId)).limit(1);
      if (existing[0]) {
        await db.update(items).set({
          stock: (existing[0].stock || 0) + item.qty,
          purchasePrice: item.purchasePrice,
        }).where(eq(items.id, item.itemId));
      }
    }
  }

  return Response.json({ purchase: inserted[0] });
}