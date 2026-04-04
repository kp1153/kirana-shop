import { db } from "@/lib/db";
import { shopSettings } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const row = await db.select().from(shopSettings).where(eq(shopSettings.userId, session.userId)).limit(1);
  return Response.json({ settings: row[0] || null });
}

export async function POST(request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const existing = await db.select().from(shopSettings).where(eq(shopSettings.userId, session.userId)).limit(1);

  if (existing.length > 0) {
    await db.update(shopSettings).set({ ...body, updatedAt: new Date().toISOString() })
      .where(eq(shopSettings.userId, session.userId));
  } else {
    await db.insert(shopSettings).values({ userId: session.userId, ...body });
  }

  return Response.json({ success: true });
}