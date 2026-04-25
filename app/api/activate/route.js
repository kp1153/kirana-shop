import { db } from "@/lib/db";
import { users, preActivations } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function POST(request) {
  const body = await request.json().catch(() => ({}));
  const secret = body.secret;

  if (secret !== process.env.HUB_SECRET) {
    return Response.json({ success: false, error: "unauthorized" }, { status: 401 });
  }

  const { email, months } = body;
  if (!email) {
    return Response.json({ success: false, error: "email required" }, { status: 400 });
  }

  const m = months || 12;
  const expiry = new Date();
  expiry.setMonth(expiry.getMonth() + m);

  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (existing.length === 0) {
    await db
      .insert(preActivations)
      .values({ email, months: m })
      .onConflictDoUpdate({
        target: preActivations.email,
        set: { months: m, createdAt: new Date().toISOString() },
      });
    return Response.json({ success: true, email, status: "pre_activated" });
  }

  await db
    .update(users)
    .set({
      status: "active",
      expiryDate: expiry.toISOString(),
      reminderSent: 0,
    })
    .where(eq(users.email, email));

  return Response.json({
    success: true,
    email,
    status: "active",
    expiryDate: expiry.toISOString(),
  });
}