import React from "react";

// Definisikan tipe untuk props ErrorCard
interface ErrorCardProps {
  errorMessage: string;
  onRetry: () => void;
}

const ErrorCard: React.FC<ErrorCardProps> = ({ errorMessage, onRetry }) => {
  return (
    <div className="w-full max-w-lg bg-red-100 border border-red-400 text-red-700 p-8 rounded-xl shadow-lg mt-8 text-center">
      <p className="font-bold text-lg mb-4">Terjadi Kesalahan</p>
      <p className="mb-6">{errorMessage}</p>
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all"
      >
        Coba Lagi
      </button>
    </div>
  );
};

export default ErrorCard;
