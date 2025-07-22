// app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Sedang memuat...
      </div>
    );
  }

  // seharusnya ini tidak pernah terjadi
  if (!isAuthenticated) {
    return null; // Atau redirect ke halaman loading/error
  }

  const fetchProtectedData = async () => {
    try {
      const res = await fetch("/api/auth/user"); // Ini akan menggunakan cookie secara otomatis
      if (res.ok) {
        const data = await res.json();
        alert(`Data terproteksi: ${JSON.stringify(data)}`);
      } else {
        const errorData = await res.json();
        alert(`Gagal mengambil data terproteksi: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error fetching protected data:", error);
      alert("Terjadi kesalahan saat mengambil data terproteksi.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="mb-6 text-3xl font-bold">
        Welcome to your Dashboard, {user?.username}!
      </h1>
      <p className="mb-8 text-lg text-gray-700">This is a protected page.</p>

      <button
        onClick={fetchProtectedData}
        className="mb-4 rounded-md bg-green-600 px-6 py-3 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        Fetch Protected Data
      </button>

      <button
        onClick={logout}
        className="rounded-md bg-red-600 px-6 py-3 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Logout
      </button>
    </div>
  );
}
