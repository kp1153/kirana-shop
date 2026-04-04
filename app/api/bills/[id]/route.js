import { db } from "@/lib/db";
import { bills, billItems } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/session";

export async function GET(request, { params }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const bill = await db.select().from(bills)
    .where(and(eq(bills.id, parseInt(id)), eq(bills.userId, session.userId))).limit(1);
  if (!bill[0]) return Response.json({ error: "नहीं मिला" }, { status: 404 });

  const bItems = await db.select().from(billItems).where(eq(billItems.billId, parseInt(id)));
  return Response.json({ bill: bill[0], items: bItems });
}