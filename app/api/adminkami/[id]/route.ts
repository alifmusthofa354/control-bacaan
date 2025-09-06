// app/api/adminkami/[id]/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Dapatkan parameter rute di sini
) {
  try {
    const unwrappedParams = await params;
    const userId = unwrappedParams.id; // Akses ID dari params

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, error, count } = await supabase
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
      `,
        { count: "exact" }
      )
      .eq("iduser", userId) // Filter berdasarkan ID dari URL
      .range(start, end)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ data, count }, { status: 200 });
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
