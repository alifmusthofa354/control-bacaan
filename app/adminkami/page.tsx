// app/page.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { fetchAllUsers } from "@/actions/adminkami";
import Link from "next/link";

// Tipe data (sebaiknya diletakkan di file terpisah, misal: types.ts)
export interface UserData {
  id: string;
  name: string;
  email: string;
}

export type BacaanWithUserData = UserData[];

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

export default function AdminPage() {
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading, isError, error } = useQuery<
    { data: BacaanWithUserData; count: number },
    Error
  >({
    queryKey: ["pembaca", page],
    queryFn: async () => {
      const result = await fetchAllUsers(page, limit);
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
      <div className="flex items-center justify-center h-screen bg-white min-h-screen">
        <p>🔄 Sedang memuat data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500 bg-white min-h-screen">
        <p>❌ Terjadi kesalahan: {error.message}</p>
      </div>
    );
  }
  console.log(displayData);
  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto p-8 ">
        <h1 className="text-3xl font-bold mb-6">Halaman AdminKami</h1>
        {displayData.length > 0 ? (
          <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="hidden px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Pembaca
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayData.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap hidden">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-6">
                        <Link
                          href={`/adminkami/${
                            item.id
                          }?name=${encodeURIComponent(item.name)}`}
                          className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md font-medium transition-colors duration-300 hover:bg-gray-300 hover:text-gray-900"
                        >
                          All
                        </Link>
                        <Link
                          href={`/adminkami/mingguan/${
                            item.id
                          }?name=${encodeURIComponent(item.name)}`}
                          className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md font-medium transition-colors duration-300 hover:bg-gray-300 hover:text-gray-900"
                        >
                          Mingguan
                        </Link>
                      </div>
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
    </div>
  );
}
