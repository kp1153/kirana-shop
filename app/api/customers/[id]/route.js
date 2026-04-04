import { db } from "@/lib/db";
import { customers, udharLedger } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/session";

export async function GET(request, { params }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const row = await db.select().from(customers)
    .where(and(eq(customers.id, parseInt(id)), eq(customers.userId, session.userId))).limit(1);
  if (!row[0]) return Response.json({ error: "नहीं मिला" }, { status: 404 });

  const ledger = await db.select().from(udharLedger).where(eq(udharLedger.customerId, parseInt(id)));
  return Response.json({ customer: row[0], ledger });
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const updated = await db.update(customers).set(body)
    .where(and(eq(customers.id, parseInt(id)), eq(customers.userId, session.userId)))
    .returning();

  return Response.json({ customer: updated[0] });
}