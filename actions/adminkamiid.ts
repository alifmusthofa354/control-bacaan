// actions/admin.ts

import axios from "axios";
import { BacaanWithUserData } from "@/types/BacaanWithUserData";

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

// Ubah fungsi agar menerima parameter userId, page, dan limit
export async function fetchAllBacaan(
  userId: string, // Tambahkan parameter userId
  page: number,
  limit: number
): Promise<FetchAllBacaanResponse> {
  try {
    const response = await apiClient.get<FetchAllBacaanResponse>(
      `/api/adminkami/${userId}?page=${page}&limit=${limit}` // Gunakan userId di URL
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
