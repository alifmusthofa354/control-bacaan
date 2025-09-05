"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  const checkAuthStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/user");
      if (res.ok) {
        const data = await res.json();
        setIsAuthenticated(true);
        setUser(data.user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        Cookies.remove("auth_token");
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async () => {
    // Asumsi token sudah disimpan di cookie oleh API login
    await checkAuthStatus();
    router.push("/dashboard");
  };

  const logout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        // Hapus cache React Query setelah server mengonfirmasi logout berhasil
        queryClient.removeQueries(); // Membersihkan seluruh cache query
      } else {
        const errorData = await res.json();
        console.error(
          "Gagal logout dari server:",
          errorData.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error(
        "Terjadi kesalahan saat mengirim permintaan logout:",
        error
      );
    } finally {
      // Selalu update state di sisi klien dan navigasi, terlepas dari hasil server
      setIsAuthenticated(false);
      setUser(null);
      router.push("/login");
    }
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
