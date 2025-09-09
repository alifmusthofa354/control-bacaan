import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Anda bisa letakkan ini di file yang sama atau di file terpisah (misal: lib/telegram.ts)

async function sendTelegramNotification(message: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error("Telegram environment variables not set!");
    return; // Keluar dari fungsi jika variabel tidak ada
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown", // Menggunakan Markdown untuk format teks
      }),
    });

    const data = await response.json();
    if (!data.ok) {
      // Jika ada error dari Telegram, log pesannya
      console.error("Error sending Telegram notification:", data.description);
    } else {
      console.log("Telegram notification sent successfully!");
    }
  } catch (error) {
    console.error("Failed to send Telegram notification:", error);
  }
}

export async function GET() {
  try {
    // Langkah 1: Dapatkan ID pengguna yang sudah membaca hari ini
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const { data: bacaanHariIni, error: bacaanError } = await supabase
      .from("bacaan")
      .select("iduser")
      .gte("created_at", todayStart.toISOString())
      .lte("created_at", todayEnd.toISOString());

    if (bacaanError) {
      throw new Error(`Error mengambil data bacaan: ${bacaanError.message}`);
    }

    const userIdsYangSudahBaca = bacaanHariIni.map((item) => item.iduser);

    // Langkah 2: Dapatkan pengguna yang TIDAK ada dalam daftar ID di atas
    // Pastikan ada user yang sudah baca sebelum menjalankan query ini
    let userBelumBaca = [];
    if (userIdsYangSudahBaca.length > 0) {
      const { data, error: userError } = await supabase
        .from("users")
        .select("name")
        .not("id", "in", `(${userIdsYangSudahBaca.join(",")})`);

      if (userError) {
        throw new Error(
          `Error mengambil user yang belum baca: ${userError.message}`
        );
      }
      userBelumBaca = data || [];
    } else {
      // Jika tidak ada yang baca sama sekali, berarti semua user belum baca
      const { data, error: userError } = await supabase
        .from("users")
        .select("name");
      if (userError) {
        throw new Error(`Error mengambil semua user: ${userError.message}`);
      }
      userBelumBaca = data || [];
    }

    // --- BAGIAN YANG DIPERBAIKI UNTUK NOTIFIKASI TELEGRAM ---

    // 1. Ekstrak nama pengguna menjadi array of strings
    const namaUserBelumBaca = userBelumBaca.map((user) => user.name);

    // 2. Buat daftar nama yang akan dikirim
    let daftarNama;
    if (namaUserBelumBaca.length > 0) {
      // Buat daftar bernomor jika ada yang belum baca
      daftarNama = namaUserBelumBaca
        .map((nama, index) => `${index + 1}. ${nama}`)
        .join("\n");
    } else {
      // Pesan jika semua sudah baca
      daftarNama = "Semua sudah membaca hari ini! 👍";
    }

    // 3. Buat pesan notifikasi yang lebih rapi
    const notificationMessage = `
*Laporan Yang Belum Baca Hari Ini* 📖

Berikut adalah daftarnya:
\`\`\`
${daftarNama}
\`\`\`
    `;

    // 4. Panggil fungsi untuk mengirim notifikasi
    await sendTelegramNotification(notificationMessage.trim());
    // --------------------------------------------------

    return NextResponse.json(userBelumBaca, { status: 200 });
  } catch (error) {
    console.error("Error in GET function:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      { message: `Failed to fetch data: ${errorMessage}` },
      { status: 500 }
    );
  }
}
