import { db } from "@/lib/db";
import { items } from "@/lib/schema";
import { eq, like, and } from "drizzle-orm";
import { getSession } from "@/lib/session";

export async function GET(request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search");
  const category = searchParams.get("category");

  let query = db.select().from(items).where(eq(items.userId, session.userId));

  const allItems = await db.select().from(items).where(eq(items.userId, session.userId));

  const filtered = allItems.filter(item => {
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()) &&
        !(item.hindiName && item.hindiName.includes(search))) return false;
    if (category && item.category !== category) return false;
    return true;
  });

  return Response.json({ items: filtered });
}

export async function POST(request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { name, hindiName, category, brand, unit, mrp, purchasePrice, stock, minStock, barcode, gst, hsn, expiry } = body;

  if (!name || !category || !mrp) {
    return Response.json({ error: "नाम, कैटेगरी और MRP ज़रूरी है" }, { status: 400 });
  }

  const inserted = await db.insert(items).values({
    userId: session.userId,
    name, hindiName: hindiName || null, category, brand: brand || null,
    unit: unit || "kg", mrp, purchasePrice: purchasePrice || null,
    stock: stock || 0, minStock: minStock || 5,
    barcode: barcode || null, gst: gst || 5, hsn: hsn || null,
    expiry: expiry || null, active: 1,
  }).returning();

  return Response.json({ item: inserted[0] });
}