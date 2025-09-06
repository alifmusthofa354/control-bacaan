// app/api/admin/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, error, count } = await supabase
      .from("users")
      .select(
        `
        id,
        email,
        name
      `,
        { count: "exact" }
      )
      .range(start, end);

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
