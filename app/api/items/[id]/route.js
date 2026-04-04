import { db } from "@/lib/db";
import { items } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/session";

export async function PUT(request, { params }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const updated = await db.update(items).set(body)
    .where(and(eq(items.id, parseInt(id)), eq(items.userId, session.userId)))
    .returning();

  return Response.json({ item: updated[0] });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await db.delete(items).where(and(eq(items.id, parseInt(id)), eq(items.userId, session.userId)));
  return Response.json({ success: true });
}