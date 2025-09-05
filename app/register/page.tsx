// app/register/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAuth } from "@/components/AuthProvider";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // Ambil fungsi login dari AuthProvider

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("Konfirmasi password tidak cocok.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Pendaftaran berhasil:", data);
        toast.success("Pendaftaran berhasil! Mengarahkan ke dashboard..."); // Pesan toast yang diperbarui
        login(); // Arahkan langsung ke dashboard
      } else {
        const errorData = await res.json();
        const errorMessage =
          errorData.message || "Pendaftaran gagal. Silakan coba lagi.";
        toast.error(errorMessage);
      }
    } catch (err: unknown) {
      let errorMessage =
        "Terjadi kesalahan yang tidak diketahui saat mendaftar.";
      if (err instanceof Error) {
        errorMessage = `Terjadi kesalahan: ${err.message}`;
      }
      toast.error(errorMessage);
      console.error("Error pendaftaran:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-purple-700">
          Register
        </h2>

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Username / Email
            </label>
            <input
              type="text"
              id="username"
              className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Konfirmasi Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 p-3 text-lg font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? "Mendaftar..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
