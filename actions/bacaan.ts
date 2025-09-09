import axios from "axios";

// Interface untuk skema data "bacaan"
// Dipindahkan ke sini agar menjadi satu sumber kebenaran untuk tipe data
export interface BacaanData {
  id: string;
  created_at: string;
  iduser: string;
  awalsurat: string;
  awalayat: string;
  akhirsurat: string;
  akhirayat: string;
}

// Membuat instance Axios dengan konfigurasi dasar
const apiClient = axios.create({
  baseURL: "/",
  withCredentials: true,
});

interface ErrorResponse {
  message: string;
}

// Fungsi untuk mengambil data bacaan
export async function fetchProtectedBacaan(): Promise<BacaanData | null> {
  try {
    const response = await apiClient.get("/api/bacaan");
    const data = response.data;
    if (Array.isArray(data) && data.length > 0) {
      return data[data.length - 1];
    }
    return null;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData: ErrorResponse = error.response.data;
      throw new Error(errorData.message || "Gagal mengambil data bacaan.");
    }
    throw new Error("Terjadi kesalahan yang tidak diketahui.");
  }
}

// Fungsi untuk membuat data bacaan baru
export async function createBacaan(
  data: Omit<BacaanData, "id" | "created_at" | "iduser">
): Promise<BacaanData> {
  try {
    const response = await apiClient.post("/api/bacaan", data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData: ErrorResponse = error.response.data;
      throw new Error(errorData.message || "Gagal membuat data bacaan.");
    }
    throw new Error("Terjadi kesalahan yang tidak diketahui.");
  }
}

// Fungsi untuk memperbarui data bacaan
export async function updateBacaan(
  data: Omit<BacaanData, "id" | "created_at" | "iduser">
): Promise<BacaanData> {
  try {
    const response = await apiClient.put("/api/bacaan", data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData: ErrorResponse = error.response.data;
      throw new Error(errorData.message || "Gagal memperbarui data bacaan.");
    }
    throw new Error("Terjadi kesalahan yang tidak diketahui.");
  }
}

// Fungsi untuk menghapus data bacaan
export async function deleteBacaan(id: string): Promise<void> {
  try {
    await apiClient.delete("/api/bacaan", { data: { id } });
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData: ErrorResponse = error.response.data;
      throw new Error(errorData.message || "Gagal menghapus data bacaan.");
    }
    throw new Error("Terjadi kesalahan yang tidak diketahui.");
  }
}
