// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs"; // Uncomment in production for password hashing
import { serialize } from "cookie";
import { generateToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json(); // Menggunakan 'username' dan 'password' sesuai frontend Anda

    // --- Validasi Input ---
    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    // Optional: Validasi format email jika 'username' adalah email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    // Optional: Validasi kekuatan password (minimal panjang, karakter khusus, dll)
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // --- Cek apakah username (email) sudah ada ---
    const { data: existingUser, error: existingUserError } = await supabase
      .from("users")
      .select("id") // Hanya ambil ID, karena kita hanya perlu tahu apakah ada
      .eq("email", username) // Asumsi 'username' dari frontend adalah 'email' di DB
      .single();

    if (existingUserError && existingUserError.code !== "PGRST116") {
      // PGRST116 adalah "No rows found"
      console.error(
        "Supabase error checking existing user:",
        existingUserError
      );
      return NextResponse.json(
        { error: "Internal Server Error, please try again later." },
        { status: 500 }
      );
    }

    if (existingUser) {
      // Jika user sudah ada
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 } // 409 Conflict
      );
    }

    // --- Hash Password (PENTING untuk produksi) ---
    const hashedPassword = await bcrypt.hash(password, 10); // Hash dengan salt 10

    // --- Masukkan user baru ke database ---
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({
        email: username, // Simpan 'username' sebagai 'email' di DB
        password: hashedPassword, // Simpan password (atau hashed password)
        // Tambahkan kolom lain yang relevan seperti 'created_at', 'role', dll.
      })
      .select("id,email") // Ambil kembali email user yang baru dibuat
      .single();

    if (insertError) {
      console.error("Supabase error inserting new user:", insertError);
      return NextResponse.json(
        { error: "Failed to register user. Please try again." },
        { status: 500 }
      );
    }

    // --- PERUBAHAN UTAMA DI SINI: Login Otomatis Setelah Register ---
    // 1. Buat token untuk user yang baru terdaftar
    const token = generateToken({ id: newUser.id, username: newUser.email });

    // 2. Kirim token sebagai HttpOnly cookie
    const cookieName = "auth_token";
    const cookieValue = token;
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Hanya kirim via HTTPS di produksi
      maxAge: 60 * 60 * 24, // 1 hari
      path: "/",
      sameSite: "lax" as const,
    };

    const serializedCookie = serialize(cookieName, cookieValue, cookieOptions);

    // 3. Buat respons sukses dan set cookie
    const response = NextResponse.json(
      { message: "Registration successful and logged in", user: newUser },
      { status: 201 }
    );
    response.headers.set("Set-Cookie", serializedCookie);
    return response;
    // --- AKHIR PERUBAHAN ---
  } catch (error) {
    console.error("Error registering user:", error);
    // Jika ada error JSON parsing atau error tak terduga lainnya
    return NextResponse.json(
      { message: "Sorry, an unexpected error occurred." },
      { status: 500 }
    );
  }
}
