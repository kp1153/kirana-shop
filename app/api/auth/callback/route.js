import { googleClient } from "@/lib/auth";
import { db } from "@/lib/db";
import { googleUsers, users, preActivations } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { createSessionCookie } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const DEVELOPER_EMAIL = "prasad.kamta@gmail.com";

function redirectWithCookie(path, token) {
  const res = NextResponse.redirect(
    new URL(path, process.env.NEXT_PUBLIC_BASE_URL),
  );
  res.cookies.set("ration_session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const cookieStore = await cookies();
  const savedState = cookieStore.get("google_state")?.value;
  const codeVerifier = cookieStore.get("google_code_verifier")?.value;

  if (!code || !state || state !== savedState || !codeVerifier) {
    return new Response("Invalid request", { status: 400 });
  }

  const tokens = await googleClient.validateAuthorizationCode(
    code,
    codeVerifier,
  );
  const accessToken = tokens.accessToken();

  const googleRes = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  const googleUser = await googleRes.json();

  // Developer whitelist
  if (googleUser.email === DEVELOPER_EMAIL) {
    const devUser = await db
      .select()
      .from(users)
      .where(eq(users.email, googleUser.email))
      .limit(1);

    let devUserId;
    if (devUser.length === 0) {
      await db.insert(users).values({
        email: googleUser.email,
        name: googleUser.name,
        status: "active",
        expiryDate: new Date("2099-12-31").toISOString(),
        reminderSent: 0,
      });
      const fetched = await db
        .select()
        .from(users)
        .where(eq(users.email, googleUser.email))
        .limit(1);
      devUserId = fetched[0].id;
    } else {
      devUserId = devUser[0].id;
    }

    const token = await createSessionCookie({
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
      userId: devUserId,
    });
    return redirectWithCookie("/dashboard", token);
  }

  // Google users record (login history)
  const existingGoogle = await db
    .select()
    .from(googleUsers)
    .where(eq(googleUsers.googleId, googleUser.id))
    .limit(1);

  if (existingGoogle.length === 0) {
    await db.insert(googleUsers).values({
      googleId: googleUser.id,
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture,
    });
  }

  // Users table entry
  let userRow = await db
    .select()
    .from(users)
    .where(eq(users.email, googleUser.email))
    .limit(1);

  if (userRow.length === 0) {
    // Check pre_activations (payment-first flow)
    const preAct = await db
      .select()
      .from(preActivations)
      .where(eq(preActivations.email, googleUser.email))
      .limit(1);

    if (preAct.length > 0) {
      const m = preAct[0].months || 12;
      const expiry = new Date();
      expiry.setMonth(expiry.getMonth() + m);

      await db.insert(users).values({
        email: googleUser.email,
        name: googleUser.name,
        status: "active",
        expiryDate: expiry.toISOString(),
        reminderSent: 0,
      });

      await db
        .delete(preActivations)
        .where(eq(preActivations.email, googleUser.email));
    } else {
      // New trial — 7 days
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

    userRow = await db
      .select()
      .from(users)
      .where(eq(users.email, googleUser.email))
      .limit(1);
  }

  const userId = userRow[0]?.id ?? null;

  // Expiry check before redirect
  const u = userRow[0];
  const now = new Date();
  const expiry = u?.expiryDate ? new Date(u.expiryDate) : null;
  const isActive = u?.status === "active" && expiry && expiry > now;
  const isTrial = u?.status === "trial" && expiry && expiry > now;

  const token = await createSessionCookie({
    email: googleUser.email,
    name: googleUser.name,
    picture: googleUser.picture,
    userId,
  });

  if (!isActive && !isTrial) {
    return redirectWithCookie("/expired", token);
  }

  return redirectWithCookie("/dashboard", token);
}