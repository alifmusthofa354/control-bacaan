"use client";

// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";
import QueryProvider from "@/components/QueryProvider";
import { Toaster } from "react-hot-toast"; // Import Toaster
import "./globals.css";
import { usePathname } from "next/navigation";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Control Bacaan",
//   description: "Control bacaan Alquran murid anda setiap hari.",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const route = ["/adminkita", "/adminkami", "adminkamu/", "/cronjoblaporan"];
  const isAdminRoute = route.some((r) => pathname.startsWith(r));

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="bg-gray-100 dark:bg-blue-900 text-blue-600">
        <QueryProvider>
          {isAdminRoute ? (
            <>
              {children}
              <Toaster />
            </>
          ) : (
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          )}
        </QueryProvider>
      </body>
    </html>
  );
}
