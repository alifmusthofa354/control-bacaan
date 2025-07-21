import { NextResponse } from "next/server";
import { serialize } from "cookie"; // Untuk HttpOnly cookie

export async function POST() {
  const cookieName = "auth_token";
  const cookieValue = "";
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Hanya kirim via HTTPS di produksi
    maxAge: 0,
    path: "/",
    sameSite: "lax" as const, // 'strict' or 'lax'
  };

  const serializedCookie = serialize(cookieName, cookieValue, cookieOptions);
  const response = NextResponse.json({ message: "Logout successful" });
  console.log("Logout successful");
  response.headers.set("Set-Cookie", serializedCookie);
  return response;
}
