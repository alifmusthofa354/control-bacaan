// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';
//import bcrypt from 'bcryptjs';
import { serialize } from 'cookie'; // Untuk HttpOnly cookie

// Contoh user statis (ganti dengan query database Anda)
const users = [
  { id: 'user1', username: 'riski@gmail.com', password: 'password123' },
  { id: 'user2', username: 'jane_doe', password: 'secure_pass' },
];

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();
 
  // 1. Cari user di database Anda
  const user = users.find(u => u.username === username);

  if (!user) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  // 2. Bandingkan password (gunakan bcrypt di produksi)
  // const isPasswordValid = await bcrypt.compare(password, user.passwordHash); // Jika Anda menyimpan hash password
  const isPasswordValid = password === user.password; // Untuk demo tanpa hash

  if (!isPasswordValid) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  // 3. Buat token
  const token = generateToken({ id: user.id, username: user.username });

  // 4. Kirim token ke client
  // Opsi A: Kirim di body response (untuk localStorage)
  // return NextResponse.json({ token });

  // Opsi B: Kirim sebagai HttpOnly cookie (lebih aman)
  const cookieName = 'auth_token';
  const cookieValue = token;
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Hanya kirim via HTTPS di produksi
    maxAge: 60 * 60 * 24,
    path: '/',
    sameSite: 'lax' as const, // 'strict' or 'lax'
  };

  const serializedCookie = serialize(cookieName, cookieValue, cookieOptions);

  const response = NextResponse.json({ message: 'Login successful' });
  response.headers.set('Set-Cookie', serializedCookie);
  return response;
}

