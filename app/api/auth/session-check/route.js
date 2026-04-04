import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ authenticated: false });
  return Response.json({ authenticated: true, user: session });
}