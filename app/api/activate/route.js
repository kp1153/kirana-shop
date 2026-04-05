import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.ACTIVATION_SECRET}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const { email, months } = await request.json();
  if (!email) return Response.json({ error: "email required" }, { status: 400 });

  const expiry = new Date();
  expiry.setMonth(expiry.getMonth() + (months || 12));

  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (existing.length === 0) {
    await db.insert(users).values({
      email,
      status: "active",
      expiryDate: expiry.toISOString(),
      reminderSent: 0,
    });
  } else {
    await db.update(users).set({
      status: "active",
      expiryDate: expiry.toISOString(),
      reminderSent: 0,
    }).where(eq(users.email, email));
  }

  return Response.json({ ok: true, email, expiryDate: expiry.toISOString() });
}