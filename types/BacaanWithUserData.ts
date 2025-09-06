// Interface untuk data user yang didapat dari tabel 'users'
export interface UserData {
  id: string;
  name: string;
  email: string;
}

// Interface untuk data bacaan yang didapat dari tabel 'bacaan'
export interface BacaanData {
  id: string;
  created_at: string;
  awalsurat: number;
  awalayat: number;
  akhirsurat: number;
  akhirayat: number;
  users: UserData; // Menggunakan interface UserData untuk relasi
}

// Interface untuk array dari data bacaan yang lengkap
export type BacaanWithUserData = BacaanData[];
