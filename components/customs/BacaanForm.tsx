import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { createBacaan } from "@/actions/bacaan";
import { quranData } from "@/lib/quran-data";

// Definisikan tipe untuk data form
interface FormState {
  awalsurat: string;
  awalayat: string;
  akhirsurat: string;
  akhirayat: string;
}

interface BacaanFormProps {
  refetch: () => void;
}

const BacaanForm: React.FC<BacaanFormProps> = ({ refetch }) => {
  const [formData, setFormData] = useState<FormState>(() => {
    const savedData = Cookies.get("bacaanFormData");
    if (savedData) {
      return JSON.parse(savedData);
    }
    return {
      awalsurat: "Al-Fatihah",
      awalayat: "1",
      akhirsurat: "Al-Fatihah",
      akhirayat: "1",
    };
  });

  const [awalAyatError, setAwalAyatError] = useState<string | null>(null);
  const [akhirAyatError, setAkhirAyatError] = useState<string | null>(null);

  const selectedAwalSurat = quranData.find((s) => s.surat === formData.awalsurat);
  const selectedAkhirSurat = quranData.find((s) => s.surat === formData.akhirsurat);

  useEffect(() => {
    if (selectedAwalSurat) {
      if (parseInt(formData.awalayat) > selectedAwalSurat.ayat) {
        setAwalAyatError(`Ayat tidak boleh lebih dari ${selectedAwalSurat.ayat}`);
      } else if (parseInt(formData.awalayat) < 1) {
        setAwalAyatError("Ayat tidak boleh kurang dari 1");
      } else {
        setAwalAyatError(null);
      }
    }
  }, [formData.awalayat, selectedAwalSurat]);

  useEffect(() => {
    if (selectedAkhirSurat) {
      if (parseInt(formData.akhirayat) > selectedAkhirSurat.ayat) {
        setAkhirAyatError(`Ayat tidak boleh lebih dari ${selectedAkhirSurat.ayat}`);
      } else if (parseInt(formData.akhirayat) < 1) {
        setAkhirAyatError("Ayat tidak boleh kurang dari 1");
      } else {
        setAkhirAyatError(null);
      }
    }
  }, [formData.akhirayat, selectedAkhirSurat]);

  useEffect(() => {
    Cookies.set("bacaanFormData", JSON.stringify(formData), { expires: 7 });
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "awalayat" || name === "akhirayat") {
      // Ensure value is a number string, default to "0" if empty
      newValue = value === "" ? "0" : value;
    }

    if (name === "awalsurat") {
      setFormData((prev) => ({ ...prev, awalsurat: newValue, akhirsurat: newValue }));
    } else if (name === "awalayat") {
      setFormData((prev) => ({ ...prev, awalayat: newValue, akhirayat: newValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: newValue }));
    }
  };

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createBacaan,
    onSuccess: () => {
      refetch();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!awalAyatError && !akhirAyatError) {
      const awalSuratNomor = quranData.find((s) => s.surat === formData.awalsurat)?.nomor;
      const akhirSuratNomor = quranData.find((s) => s.surat === formData.akhirsurat)?.nomor;

      if (awalSuratNomor && akhirSuratNomor) {
        mutate({
          ...formData,
          awalsurat: awalSuratNomor.toString(),
          akhirsurat: akhirSuratNomor.toString(),
        });
      }
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Isi Bacaan Baru Anda
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="awalsurat"
            className="block text-gray-700 font-medium"
          >
            Awal Surat
          </label>
          <select
            id="awalsurat"
            name="awalsurat"
            value={formData.awalsurat}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            {quranData.map((surat) => (
              <option key={surat.nomor} value={surat.surat}>
                {surat.nomor}. {surat.surat}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="awalayat" className="block text-gray-700 font-medium">
            Awal Ayat
          </label>
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => handleChange({ target: { name: "awalayat", value: (parseInt(formData.awalayat || "0") - 1).toString() } } as React.ChangeEvent<HTMLInputElement>)}
              disabled={parseInt(formData.awalayat || "0") <= 1}
              className="px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MinusIcon className="w-4 h-4 text-gray-600" />
            </button>
            <input
              type="number"
              id="awalayat"
              name="awalayat"
              value={formData.awalayat}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border-t border-b border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center"
            />
            <button
              type="button"
              onClick={() => handleChange({ target: { name: "awalayat", value: (parseInt(formData.awalayat || "0") + 1).toString() } } as React.ChangeEvent<HTMLInputElement>)}
              className="px-3 py-2 border border-gray-300 rounded-r-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <PlusIcon className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          {awalAyatError && <p className="text-red-500 text-xs">{awalAyatError}</p>}
        </div>
        <div className="space-y-2">
          <label
            htmlFor="akhirsurat"
            className="block text-gray-700 font-medium"
          >
            Akhir Surat
          </label>
          <select
            id="akhirsurat"
            name="akhirsurat"
            value={formData.akhirsurat}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            {quranData.map((surat) => (
              <option key={surat.nomor} value={surat.surat}>
                {surat.nomor}. {surat.surat}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="akhirayat"
            className="block text-gray-700 font-medium"
          >
            Akhir Ayat
          </label>
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => handleChange({ target: { name: "akhirayat", value: (parseInt(formData.akhirayat || "0") - 1).toString() } } as React.ChangeEvent<HTMLInputElement>)}
              disabled={parseInt(formData.akhirayat || "0") <= 1}
              className="px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MinusIcon className="w-4 h-4 text-gray-600" />
            </button>
            <input
              type="number"
              id="akhirayat"
              name="akhirayat"
              value={formData.akhirayat}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border-t border-b border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center"
            />
            <button
              type="button"
              onClick={() => handleChange({ target: { name: "akhirayat", value: (parseInt(formData.akhirayat || "0") + 1).toString() } } as React.ChangeEvent<HTMLInputElement>)}
              className="px-3 py-2 border border-gray-300 rounded-r-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <PlusIcon className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          {akhirAyatError && <p className="text-red-500 text-xs">{akhirAyatError}</p>}
        </div>
        <button
          type="submit"
          disabled={isPending || !!awalAyatError || !!akhirAyatError}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Menyimpan..." : "Simpan Data"}
        </button>
      </form>
      {isError && (
        <p className="mt-4 text-sm text-red-600 text-center">
          Gagal menyimpan data:{" "}
          {error instanceof Error ? error.message : "Terjadi kesalahan."}
        </p>
      )}
    </div>
  );
};

export default BacaanForm;

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function MinusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
    </svg>
  );
}

