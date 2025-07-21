import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Tambahkan fungsi redirects() di sini
  async redirects() {
    return [
      {
        source: "/", // Path atau pola URL yang ingin Anda redirect
        destination: "/dashboard", // Path atau URL tujuan redirect
        permanent: true, // true untuk 301 Redirect (permanen), false untuk 302 Redirect (sementara)
      },
      // Anda bisa menambahkan redirect lain di sini jika diperlukan
      // Contoh: redirect dari /old-page ke /new-page
      // {
      //   source: '/old-page',
      //   destination: '/new-page',
      //   permanent: true,
      // },
    ];
  },
};

export default nextConfig;
