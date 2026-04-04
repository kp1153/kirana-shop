import { generateCodeVerifier, generateState } from "arctic";
import { googleClient } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url = googleClient.createAuthorizationURL(state, codeVerifier, [
    "openid", "email", "profile",
  ]);

  const cookieStore = await cookies();
  cookieStore.set("google_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10,
  });
  cookieStore.set("google_code_verifier", codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10,
  });

  return Response.redirect(url);
}