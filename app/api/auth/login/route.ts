// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { serialize } from "cookie"; // Untuk HttpOnly cookie
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    // 1. Cari user di database Anda

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id,email, password")
      .eq("email", username)
      .single();

    if (userError && userError.code !== "PGRST116") {
      console.error("Supabase error fetching classroom data:", userError);
      return NextResponse.json(
        {
          error: "Internal Server Error, please try again later.",
        },
        { status: 500 }
      );
    }

    if (!userData) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 2. Bandingkan password (gunakan bcrypt di produksi)
    const isPasswordValid = await bcrypt.compare(password, userData.password); // Jika Anda menyimpan hash password
    //const isPasswordValid = password === userData.password; // Untuk demo tanpa hash

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 3. Buat token
    const token = generateToken({ id: userData.id, username: userData.email });

    // 4. Kirim token ke client
    // Opsi A: Kirim di body response (untuk localStorage)
    // return NextResponse.json({ token });

    // Opsi B: Kirim sebagai HttpOnly cookie (lebih aman)
    const cookieName = "auth_token";
    const cookieValue = token;
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Hanya kirim via HTTPS di produksi
      maxAge: 60 * 60 * 24,
      path: "/",
      sameSite: "lax" as const, // 'strict' or 'lax'
    };

    const serializedCookie = serialize(cookieName, cookieValue, cookieOptions);

    const response = NextResponse.json({ message: "Login successful" });
    response.headers.set("Set-Cookie", serializedCookie);
    return response;
  } catch (error) {
    console.error("Error login user:", error);
    return NextResponse.json(
      { message: "Sorry, we have a problem" },
      { status: 500 }
    );
  }
}
