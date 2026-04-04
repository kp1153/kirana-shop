import { db } from "@/lib/db";
import { udharLedger, customers } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/session";

export async function POST(request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { customerId, amount, note } = body;

  if (!customerId || !amount) {
    return Response.json({ error: "ग्राहक और रकम ज़रूरी है" }, { status: 400 });
  }

  await db.insert(udharLedger).values({
    userId: session.userId,
    customerId,
    type: "credit",
    amount,
    note: note || "भुगतान मिला",
  });

  const cust = await db.select().from(customers).where(eq(customers.id, customerId)).limit(1);
  if (cust[0]) {
    await db.update(customers).set({ udhar: Math.max(0, (cust[0].udhar || 0) - amount) })
      .where(eq(customers.id, customerId));
  }

  return Response.json({ success: true });
}