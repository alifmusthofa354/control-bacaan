import React from "react";

// Definisikan tipe untuk props Header
interface HeaderProps {
  userEmail: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ userEmail, onLogout }) => {
  return (
    <header className="bg-white shadow-md w-full p-4 flex justify-between items-center rounded-b-xl">
      <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <span className="text-gray-600 font-medium hidden sm:block">
          {userEmail}
        </span>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-all text-sm"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
