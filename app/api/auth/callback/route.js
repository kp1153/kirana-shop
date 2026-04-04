import { googleClient } from "@/lib/auth";
import { db } from "@/lib/db";
import { googleUsers, users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { createSessionCookie } from "@/lib/session";
import { cookies } from "next/headers";

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const cookieStore = await cookies();
  const savedState = cookieStore.get("google_state")?.value;
  const codeVerifier = cookieStore.get("google_code_verifier")?.value;

  if (!code || !state || state !== savedState || !codeVerifier) {
    return new Response("गलत request", { status: 400 });
  }

  const tokens = await googleClient.validateAuthorizationCode(code, codeVerifier);
  const accessToken = tokens.accessToken();

  const googleRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const googleUser = await googleRes.json();

  const existing = await db.select().from(googleUsers).where(eq(googleUsers.googleId, googleUser.id)).limit(1);

  if (existing.length === 0) {
    await db.insert(googleUsers).values({
      googleId: googleUser.id,
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
    });

    const userExists = await db.select().from(users).where(eq(users.email, googleUser.email)).limit(1);
    if (userExists.length === 0) {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 7);
      await db.insert(users).values({
        email: googleUser.email,
        name: googleUser.name,
        status: "trial",
        expiryDate: expiry.toISOString(),
        reminderSent: 0,
      });
    }
  }

  await createSessionCookie({
    email: googleUser.email,
    name: googleUser.name,
    picture: googleUser.picture,
  });

  return Response.redirect(new URL("/dashboard", process.env.NEXT_PUBLIC_BASE_URL));
}