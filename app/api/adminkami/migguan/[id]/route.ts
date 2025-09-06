import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const unwrappedParams = await params;
    const userId = unwrappedParams.id;

    // Menghitung tanggal 7 hari yang lalu
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const { data, error } = await supabase
      .from("bacaan")
      .select(
        `
        id,
        created_at,
        awalsurat,
        awalayat,
        akhirsurat,
        akhirayat,
        users (
          id,
          name,
          email
        )
      `
      )
      .eq("iduser", userId)
      .gte("created_at", sevenDaysAgo.toISOString()) // Filter data dari 7 hari yang lalu
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      { message: `Failed to fetch data: ${errorMessage}` },
      { status: 500 }
    );
  }
}
