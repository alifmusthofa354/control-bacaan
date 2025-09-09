import React from "react";
import { useMutation } from "@tanstack/react-query";
import { deleteBacaan, BacaanData } from "@/actions/bacaan";
import UpdateBacaanForm from "./UpdateBacaanForm";
import { quranData } from "@/lib/quran-data";

interface BacaanCardProps {
  bacaan: BacaanData;
  refetch: () => void;
}

const BacaanCard: React.FC<BacaanCardProps> = ({ bacaan, refetch }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: deleteBacaan,
    onSuccess: () => {
      refetch();
    },
  });

  const handleDelete = () => {
    mutate(bacaan.id);
  };

  return (
    <div className="w-full h-full max-w-4xl relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out border border-gray-200/80 overflow-hidden">
      {isEditing && (
        <UpdateBacaanForm
          bacaan={bacaan}
          refetch={refetch}
          onClose={() => setIsEditing(false)}
        />
      )}
      <div className="h-full flex flex-col items-center justify-center text-center p-6">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center">
          <BookIcon className="w-7 h-7 mr-3 text-blue-500" />
          <span>Detail Bacaan</span>
        </h3>

        <h6 className="text-xl text-gray-600 mb-2">
          {new Date(bacaan.created_at).toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h6>

        <div className="space-y-6 text-lg text-gray-600">
          <div className="flex flex-col items-center">
            <div className="flex items-center font-semibold text-gray-700 mb-1">
              <PinIcon className="w-5 h-5 mr-2 text-green-500" />
              <span>Awal</span>
            </div>
            <span className="text-xl">
              {
                quranData.find((s) => s.nomor === parseInt(bacaan.awalsurat))
                  ?.nomor
              }
              .{" "}
              {
                quranData.find((s) => s.nomor === parseInt(bacaan.awalsurat))
                  ?.surat
              }{" "}
              ({bacaan.awalayat})
            </span>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center font-semibold text-gray-700 mb-1">
              <PinIcon className="w-5 h-5 mr-2 text-red-500" />
              <span>Akhir</span>
            </div>
            <span className="text-xl">
              {
                quranData.find((s) => s.nomor === parseInt(bacaan.akhirsurat))
                  ?.nomor
              }
              .{" "}
              {
                quranData.find((s) => s.nomor === parseInt(bacaan.akhirsurat))
                  ?.surat
              }{" "}
              ({bacaan.akhirayat})
            </span>
          </div>
        </div>
      </div>
      {!isEditing && (
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <MoreVerticalIcon className="w-6 h-6" />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <EditIcon className="w-4 h-4 mr-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    handleDelete();
                    setIsMenuOpen(false);
                  }}
                  disabled={isPending}
                  className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-gray-100 flex items-center disabled:opacity-50"
                >
                  {isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-200 border-t-red-600 rounded-full animate-spin mr-3"></div>
                      <span>Menghapus...</span>
                    </>
                  ) : (
                    <>
                      <TrashIcon className="w-4 h-4 mr-3" />
                      <span>Hapus</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BacaanCard;

function BookIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function PinIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <line x1="12" x2="12" y1="17" y2="22" />
      <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
    </svg>
  );
}

function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function EditIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function MoreVerticalIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}
