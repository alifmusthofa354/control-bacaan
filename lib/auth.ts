// lib/auth.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development'; // Pastikan ini aman di produksi!

type UserPayload = {
  id: string;
  username: string;
  // Tambahkan data user lain yang ingin disimpan di token
}

export const generateToken = (payload: UserPayload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Token berlaku 1 jam
};

export const verifyToken = (token: string): UserPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};