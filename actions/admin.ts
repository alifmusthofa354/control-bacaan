// actions/admin.ts

import axios from "axios";
import { BacaanWithUserData } from "@/types/BacaanWithUserData"; // Asumsikan tipe data berada di sini

const apiClient = axios.create({
  baseURL: "/",
  withCredentials: true,
});

interface ErrorResponse {
  message: string;
}

interface FetchAllBacaanResponse {
  data: BacaanWithUserData;
  count: number;
}

// Ubah fungsi agar menerima parameter page dan limit
export async function fetchAllBacaan(
  page: number,
  limit: number
): Promise<FetchAllBacaanResponse> {
  try {
    const response = await apiClient.get<FetchAllBacaanResponse>(
      `/api/admin?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData: ErrorResponse = error.response.data;
      throw new Error(errorData.message || "Gagal mengambil data bacaan.");
    }
    throw new Error("Terjadi kesalahan yang tidak diketahui.");
  }
}
