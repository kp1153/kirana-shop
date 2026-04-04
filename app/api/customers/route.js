import { db } from "@/lib/db";
import { customers } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const all = await db.select().from(customers).where(eq(customers.userId, session.userId));
  return Response.json({ customers: all });
}

export async function POST(request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { name, phone, address } = body;
  if (!name) return Response.json({ error: "नाम ज़रूरी है" }, { status: 400 });

  const inserted = await db.insert(customers).values({
    userId: session.userId,
    name, phone: phone || null, address: address || null, udhar: 0,
  }).returning();

  return Response.json({ customer: inserted[0] });
}