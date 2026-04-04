import { deleteSessionCookie } from "@/lib/session";

export async function POST() {
  await deleteSessionCookie();
  return Response.redirect(new URL("/", process.env.NEXT_PUBLIC_BASE_URL));
}