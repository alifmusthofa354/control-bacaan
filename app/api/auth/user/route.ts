// app/api/auth/user/route.ts
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers"; // Untuk membaca cookies dari server

export async function GET() {
  // Ambil token dari HttpOnly cookie
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized: No token provided" },
      { status: 401 }
    );
  }

  // verify token
  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json(
      { message: "Unauthorized: Invalid token" },
      { status: 401 }
    );
  }

  // Jika token valid, Anda bisa mengambil data user dari database berdasarkan decoded.id
  // Untuk demo, kita kembalikan data dari token
  return NextResponse.json({
    message: "Protected data accessed successfully!",
    user: {
      id: decoded.id,
      username: decoded.username,
    },
  });
}
