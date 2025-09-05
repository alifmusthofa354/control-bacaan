import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

import { updateBacaan, BacaanData } from "@/actions/bacaan";
import { quranData } from "@/lib/quran-data";

interface UpdateBacaanFormProps {
  bacaan: BacaanData;
  refetch: () => void;
  onClose: () => void;
}

const UpdateBacaanForm: React.FC<UpdateBacaanFormProps> = ({
  bacaan,
  refetch,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    id: bacaan.id,
    awalsurat:
      quranData.find((s) => s.nomor === parseInt(bacaan.awalsurat))?.surat ||
      "",
    awalayat: bacaan.awalayat,
    akhirsurat:
      quranData.find((s) => s.nomor === parseInt(bacaan.akhirsurat))?.surat ||
      "",
    akhirayat: bacaan.akhirayat,
  });

  const [awalAyatError, setAwalAyatError] = useState<string | null>(null);
  const [akhirAyatError, setAkhirAyatError] = useState<string | null>(null);

  const selectedAwalSurat = quranData.find(
    (s) => s.surat === formData.awalsurat
  );
  const selectedAkhirSurat = quranData.find(
    (s) => s.surat === formData.akhirsurat
  );

  useEffect(() => {
    if (selectedAwalSurat) {
      if (parseInt(formData.awalayat) > selectedAwalSurat.ayat) {
        setAwalAyatError(
          `Ayat tidak boleh lebih dari ${selectedAwalSurat.ayat}`
        );
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
        setAkhirAyatError(
          `Ayat tidak boleh lebih dari ${selectedAkhirSurat.ayat}`
        );
      } else if (parseInt(formData.akhirayat) < 1) {
        setAkhirAyatError("Ayat tidak boleh kurang dari 1");
      } else {
        setAkhirAyatError(null);
      }
    }
  }, [formData.akhirayat, selectedAkhirSurat]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "awalsurat") {
      setFormData((prev) => ({ ...prev, awalsurat: value, akhirsurat: value }));
    } else if (name === "awalayat") {
      setFormData((prev) => ({ ...prev, awalayat: value, akhirayat: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: updateBacaan,
    onSuccess: () => {
      refetch();
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!awalAyatError && !akhirAyatError) {
      const awalSuratNomor = quranData.find(
        (s) => s.surat === formData.awalsurat
      )?.nomor;
      const akhirSuratNomor = quranData.find(
        (s) => s.surat === formData.akhirsurat
      )?.nomor;

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
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Update Bacaan
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
            <label
              htmlFor="awalayat"
              className="block text-gray-700 font-medium"
            >
              Awal Ayat
            </label>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() =>
                  handleChange({
                    target: {
                      name: "awalayat",
                      value: (
                        parseInt(formData.awalayat || "0") - 1
                      ).toString(),
                    },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
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
                onClick={() =>
                  handleChange({
                    target: {
                      name: "awalayat",
                      value: (
                        parseInt(formData.awalayat || "0") + 1
                      ).toString(),
                    },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                className="px-3 py-2 border border-gray-300 rounded-r-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <PlusIcon className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            {awalAyatError && (
              <p className="text-red-500 text-xs">{awalAyatError}</p>
            )}
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
                onClick={() =>
                  handleChange({
                    target: {
                      name: "akhirayat",
                      value: (
                        parseInt(formData.akhirayat || "0") - 1
                      ).toString(),
                    },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
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
                onClick={() =>
                  handleChange({
                    target: {
                      name: "akhirayat",
                      value: (
                        parseInt(formData.akhirayat || "0") + 1
                      ).toString(),
                    },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                className="px-3 py-2 border border-gray-300 rounded-r-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <PlusIcon className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            {akhirAyatError && (
              <p className="text-red-500 text-xs">{akhirAyatError}</p>
            )}
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 font-semibold rounded-lg hover:bg-gray-100 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending || !!awalAyatError || !!akhirAyatError}
              className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
        {isError && (
          <p className="mt-4 text-sm text-red-600 text-center">
            Gagal menyimpan data:{" "}
            {error instanceof Error ? error.message : "Terjadi kesalahan."}
          </p>
        )}
      </div>
    </div>
  );
};

export default UpdateBacaanForm;

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
