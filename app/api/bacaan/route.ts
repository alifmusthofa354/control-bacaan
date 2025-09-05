import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { JwtPayload } from "jsonwebtoken";

// Interface untuk skema data "bacaan"
export interface BacaanData {
  id?: string;
  iduser?: string;
  awalsurat: string;
  awalayat: string;
  akhirsurat: string;
  akhirayat: string;
}

// Interface untuk payload token JWT yang sudah di-decode
interface DecodedTokenPayload extends JwtPayload {
  id: string;
  username: string;
}

// Interface untuk hasil verifikasi otentikasi
interface AuthResult {
  userId?: string;
  error?: string;
  status?: number;
}

// Fungsi utilitas untuk memverifikasi token dan mendapatkan ID pengguna
const verifyAuth = async (): Promise<AuthResult> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return { error: "Unauthorized: No token provided", status: 401 };
  }

  try {
    const decoded = verifyToken(token) as DecodedTokenPayload;

    if (!decoded || !decoded.id) {
      return { error: "Unauthorized: Invalid token", status: 401 };
    }

    return { userId: decoded.id };
  } catch (e) {
    console.error("Error verifying token:", e);
    return { error: "Unauthorized: Token verification failed", status: 401 };
  }
};

// GET: Mengambil data bacaan untuk pengguna yang login
export async function GET(): Promise<NextResponse> {
  const authResult = await verifyAuth();
  if (authResult.error) {
    return NextResponse.json(
      { message: authResult.error },
      { status: authResult.status }
    );
  }
  const { userId } = authResult;

  try {
    const { data: userData, error: userError } = await supabase
      .from("bacaan")
      .select("id, iduser, awalsurat, awalayat, akhirsurat, akhirayat")
      .eq("iduser", userId)
      .gte("created_at", `${new Date().toISOString().split("T")[0]}T00:00:00Z`)
      .lte("created_at", `${new Date().toISOString().split("T")[0]}T23:59:59Z`);

    if (userError) {
      throw new Error(userError.message);
    }

    // Jika tidak ada data, kembalikan array kosong
    if (!userData) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      { message: `Failed to fetch data: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// POST: Membuat data bacaan baru
export async function POST(request: NextRequest): Promise<NextResponse> {
  const authResult = await verifyAuth();
  if (authResult.error) {
    return NextResponse.json(
      { message: authResult.error },
      { status: authResult.status }
    );
  }
  const { userId } = authResult;
  const { awalsurat, awalayat, akhirsurat, akhirayat } =
    (await request.json()) as BacaanData;

  try {
    const { data, error } = await supabase
      .from("bacaan")
      .insert([
        {
          iduser: userId,
          awalsurat,
          awalayat,
          akhirsurat,
          akhirayat,
        },
      ])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    console.error("Error creating new data:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      { message: `Failed to create data: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// PUT: Memperbarui data bacaan yang sudah ada
export async function PUT(request: NextRequest): Promise<NextResponse> {
  const authResult = await verifyAuth();
  if (authResult.error) {
    return NextResponse.json(
      { message: authResult.error },
      { status: authResult.status }
    );
  }
  const { userId } = authResult;
  const { id, awalsurat, awalayat, akhirsurat, akhirayat } =
    (await request.json()) as BacaanData;

  if (!id) {
    return NextResponse.json(
      { message: "ID is required for updating" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("bacaan")
      .update({
        awalsurat,
        awalayat,
        akhirsurat,
        akhirayat,
      })
      .eq("id", id)
      .eq("iduser", userId)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    if (data.length === 0) {
      return NextResponse.json(
        { message: "No data found or unauthorized to update" },
        { status: 404 }
      );
    }

    return NextResponse.json(data[0], { status: 200 });
  } catch (error) {
    console.error("Error updating data:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      { message: `Failed to update data: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// DELETE: Menghapus data bacaan
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const authResult = await verifyAuth();
  if (authResult.error) {
    return NextResponse.json(
      { message: authResult.error },
      { status: authResult.status }
    );
  }
  const { userId } = authResult;
  const { id } = (await request.json()) as { id: string };

  if (!id) {
    return NextResponse.json(
      { message: "ID is required for deletion" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("bacaan")
      .delete()
      .eq("id", id)
      .eq("iduser", userId)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    if (data.length === 0) {
      return NextResponse.json(
        { message: "No data found or unauthorized to delete" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Data deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting data:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json(
      { message: `Failed to delete data: ${errorMessage}` },
      { status: 500 }
    );
  }
}
