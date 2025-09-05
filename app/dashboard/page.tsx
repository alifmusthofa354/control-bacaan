"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { fetchProtectedBacaan, BacaanData } from "@/actions/bacaan";
import Header from "@/components/customs/Header";
import BacaanCard from "@/components/customs/BacaanCard";
import BacaanForm from "@/components/customs/BacaanForm";
import ErrorCard from "@/components/customs/ErrorCard";

export default function Page() {
  const { isAuthenticated, user, logout, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const {
    data: protectedData,
    isLoading: isDataLoading,
    isError: isDataError,
    error: dataError,
    refetch,
  } = useQuery<BacaanData | null>({
    queryKey: ["protectedBacaan", user?.id],
    queryFn: fetchProtectedBacaan,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthLoading, isAuthenticated, router]);

  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600 font-semibold">
          Sedang memuat autentikasi...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Header userEmail={user?.username || ""} onLogout={logout} />

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        {isDataLoading && (
          <div className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-lg text-center text-gray-600">
            <p>Sedang memuat data terproteksi...</p>
          </div>
        )}

        {isDataError && (
          <ErrorCard
            errorMessage={
              dataError instanceof Error
                ? dataError.message
                : "Terjadi kesalahan."
            }
            onRetry={refetch}
          />
        )}

        <div className="w-full h-[80vh] flex items-center justify-center">
          {protectedData ? (
            <BacaanCard bacaan={protectedData} refetch={refetch} />
          ) : (
            <BacaanForm refetch={refetch} />
          )}
        </div>
      </main>
    </div>
  );
}
