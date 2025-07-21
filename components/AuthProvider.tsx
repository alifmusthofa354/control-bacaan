"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { id: string; username: string } | null;
  login: () => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{ id: string; username: string } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Di sini Anda bisa mencoba memverifikasi token saat aplikasi dimuat
    // Misalnya, panggil API /api/auth/user untuk memvalidasi token yang ada di cookie
    const checkAuthStatus = async () => {
      try {
        const res = await fetch("/api/auth/user");
        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(true);
          setUser(data.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
          // Hapus cookie jika tidak valid
          Cookies.remove("auth_token"); // Pastikan nama cookie sesuai
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    // Setelah login berhasil, Anda mungkin perlu mengambil detail user lagi
    // Atau bisa langsung set user jika API login mengembalikan data user
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/user");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user after login:", error);
      }
    };
    fetchUser();
    router.push("/dashboard");
  };

  const logout = () => {
    // Hapus token dari localStorage
    // localStorage.removeItem('auth_token');
    const userLogout = async () => {
      // <-- Fungsi logout harus async
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // credentials: 'include', // Tambahkan ini jika server membutuhkan kredensial
        });

        if (res.ok) {
          // Server berhasil menghapus HttpOnly cookie
          // Sekarang update state di sisi klien dan navigasi
          setIsAuthenticated(false);
          setUser(null);
          router.push("/login");
        } else {
          // Jika server mengembalikan respons error
          const errorData = await res.json();
          console.error(
            "Gagal logout dari server:",
            errorData.message || "Unknown error"
          );
          // Tampilkan pesan error ke pengguna jika perlu
        }
      } catch (error) {
        // Tangani error jaringan atau lainnya yang mencegah permintaan terkirim
        console.error(
          "Terjadi kesalahan saat mengirim permintaan logout:",
          error
        );
        // Tampilkan pesan error ke pengguna jika perlu
      }
    };
    userLogout();
    setIsAuthenticated(false);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
