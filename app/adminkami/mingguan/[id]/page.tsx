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

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto p-8">
        <div
          ref={tableRef}
          className="flex flex-col min-h-[1000px] min-w-[1000px]" // Tambahkan flex flex-col
        >
          {/* Kontainer untuk semua elemen di atas div "ok bos" */}
          <div className="flex-grow">
            <div className="flex items-center mb-6 relative">
              <div>
                <img
                  src="/logo.png"
                  alt="Logo perusahaan"
                  width={128}
                  height={128}
                  className="ml-4 mt-4"
                />
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-4xl font-bold mb-4 text-center">
                  السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللّٰــــــہِ
                  وَبَرَكَاتُـــــــہُ
                </p>
                <h3 className="text-3xl font-bold text-center">
                  Buku Laporan Bacaan
                </h3>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-6 ml-6">Nama : {name}</h3>
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
              <p
                className="text-center text-3xl font-bold mb-6 mt-64"
                style={{ color: "red" }}
              >
                Belum Menderes Surat.
              </p>
            )}
          </div>

          {/* Div ini akan selalu berada di bawah */}
          <div className="mt-auto pb-28 text-center text-2xl font-bold">
            {displayData.length > 5 ? (
              <p>
                Sudah semangat dalam membaca alquran. Kami dari pjp kelompok
                mensyukuri
              </p>
            ) : displayData.length > 3 ? (
              <p>
                Sudah bagus, namun Amalsholih lebih ditingkatkan lagi untuk
                membaca alquran
              </p>
            ) : displayData.length > 1 ? (
              <p>Amalsholih lebih ditingkatkan lagi untuk membaca alquran</p>
            ) : (
              <p>
                Amalsholih untuk di ingatkan untuk membaca alquran minimal 3
                ayat sehari.
              </p>
            )}
            <h3 className="my-6 text-4xl">
              الحمد للّٰــہ جزاكـم اللّٰــہ خيرا
            </h3>
          </div>
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
    </div>
  );
}
