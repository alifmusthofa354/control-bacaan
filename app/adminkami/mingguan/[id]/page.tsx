// app/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { fetchAllBacaan } from "@/actions/adminkamimingguan";
import { quranData } from "@/lib/quran-data";
import { use } from "react";
import html2canvas from "html2canvas";

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
    weekday: "long",
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

export default function AdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const unwrappedParams = use(params);
  const userId = unwrappedParams.id;
  const tableRef = useRef<HTMLTableElement>(null);

  const { data, isLoading, isError, error } = useQuery<
    { data: BacaanWithUserData; count: number },
    Error
  >({
    queryKey: ["detailpembacamingguan", userId],
    queryFn: async () => {
      const result = await fetchAllBacaan(userId);
      return result;
    },
    placeholderData: (previousData) => previousData,
  });

  const handleDownloadImage = () => {
    if (tableRef.current) {
      html2canvas(tableRef.current).then((canvas) => {
        const link = document.createElement("a");
        link.download = `laporan-bacaan-${
          displayData[0]?.users?.name || name || "data"
        }.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    }
  };

  const displayData = data?.data || [];

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
        <div ref={tableRef} className=" items-center justify-center min-h-96">
          <h3 className="text-3xl font-bold mb-6 ml-6 text-center">{name}</h3>
          {displayData.length > 0 ? (
            <div
              className="overflow-x-auto rounded-lg shadow-md"
              style={{ backgroundColor: "#ffffff" }}
            >
              <table
                className="min-w-full"
                style={{ borderCollapse: "collapse", borderColor: "#e5e7eb" }}
              >
                <thead style={{ backgroundColor: "#f9fafb" }}>
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: "#6b7280" }}
                    >
                      Tanggal
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: "#6b7280" }}
                    >
                      Awal Surat
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: "#6b7280" }}
                    >
                      Awal Ayat
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: "#6b7280" }}
                    >
                      Akhir Surat
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: "#6b7280" }}
                    >
                      Akhir Ayat
                    </th>
                  </tr>
                </thead>
                <tbody
                  style={{
                    backgroundColor: "#ffffff",
                    borderTop: "1px solid #e5e7eb",
                  }}
                >
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
            <p className=" text-center">Belum Menderes Surat.</p>
          )}
        </div>
      </div>

      {/* Tombol dengan posisi fixed di sisi kanan bawah */}
      <div className="fixed bottom-3 right-8 z-10">
        <button
          onClick={handleDownloadImage}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors shadow-lg"
        >
          Unduh Gambar Tabel
        </button>
      </div>
    </>
  );
}
