// app/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchAllBacaan } from "@/actions/adminkamiid";
import { quranData } from "@/lib/quran-data";
import { use } from "react";

// Tipe data (sebaiknya diletakkan di file terpisah, misal: types.ts)
export interface UserData {
  id: string;
  name: string;
  email: string;
}

export interface BacaanData {
  id: string;
  created_at: string;
  awalsurat: number;
  awalayat: number;
  akhirsurat: number;
  akhirayat: number;
  users: UserData;
}

export type BacaanWithUserData = BacaanData[];

// Fungsi helper untuk memformat tanggal
const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleDateString("id-ID", options);
};

// Fungsi helper untuk mendapatkan nama surat dari nomor surat
const getSurahName = (surahNumber: number) => {
  const surah = quranData.find((s) => s.nomor === surahNumber);
  return surah ? surah.surat : `Surat ${surahNumber}`;
};

// Fungsi untuk membuat array nomor halaman, termasuk "..." jika perlu
const generatePaginationNumbers = (currentPage: number, totalPages: number) => {
  const maxPagesToShow = 5;
  const pages: (number | string)[] = [];

  if (totalPages <= maxPagesToShow) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    if (start > 2) {
      pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push("...");
    }
    pages.push(totalPages);
  }

  return pages;
};

export default function AdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const userId = unwrappedParams.id;
  const [page, setPage] = useState(1);
  const limit = 7;

  const { data, isLoading, isError, error } = useQuery<
    { data: BacaanWithUserData; count: number },
    Error
  >({
    queryKey: ["detailpembaca", userId, page],
    queryFn: async () => {
      const result = await fetchAllBacaan(userId, page, limit);
      return result;
    },
    placeholderData: (previousData) => previousData,
  });

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const displayData = data?.data || [];
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>🔄 Sedang memuat data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <p>❌ Terjadi kesalahan: {error.message}</p>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-8">
        <h3 className="text-3xl font-bold mb-6">
          {displayData[0]?.users?.name}
        </h3>
        {displayData.length > 0 ? (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Awal Surat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Awal Ayat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akhir Surat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akhir Ayat
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayData.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getSurahName(item.awalsurat)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.awalayat}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getSurahName(item.akhirsurat)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.akhirayat}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center">Data tidak ditemukan.</p>
        )}
      </div>

      <div className="flex justify-center mt-8 space-x-4">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className="px-4 py-2 border rounded-md disabled:opacity-50"
        >
          &larr;
        </button>
        {generatePaginationNumbers(page, totalPages).map((p, index) => (
          <button
            key={index}
            onClick={() => typeof p === "number" && setPage(p)}
            className={`px-4 py-2 border rounded-md ${
              p === page ? "bg-blue-500 text-white" : "bg-white text-gray-700"
            } ${typeof p !== "number" ? "cursor-default" : ""}`}
            disabled={typeof p !== "number"}
          >
            {p}
          </button>
        ))}
        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className="px-4 py-2 border rounded-md disabled:opacity-50"
        >
          &rarr;
        </button>
      </div>
    </>
  );
}
