
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase-admin";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const authClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

function getItemImagePath(imageUrl: unknown): string | null {
  if (typeof imageUrl !== "string" || !imageUrl.trim()) {
    return null;
  }

  try {
    const projectUrl = new URL(supabaseUrl);
    const image = new URL(imageUrl);
    const marker = "/storage/v1/object/public/item-images/";

    // Hanya kelola gambar dari project dan bucket yang diizinkan.
    if (image.origin !== projectUrl.origin) return null;
    if (!image.pathname.startsWith(marker)) return null;

    const path = decodeURIComponent(image.pathname.slice(marker.length));

    if (
      !path ||
      path.startsWith("/") ||
      path.split("/").some((part) => part === "." || part === "..")
    ) {
      return null;
    }

    return path;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    // 1. Verifikasi access token.
    const authorization = request.headers.get("authorization");
    const token = authorization?.startsWith("Bearer ")
      ? authorization.slice(7).trim()
      : "";

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Silakan login kembali." },
        { status: 401 }
      );
    }

    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser(token);

    if (authError || !user?.email) {
      return NextResponse.json(
        { success: false, message: "Sesi login tidak valid." },
        { status: 401 }
      );
    }

    // 2. Pastikan pengguna adalah admin.
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("email", user.email)
      .single();

    if (profileError || profile?.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Akses hanya untuk admin." },
        { status: 403 }
      );
    }

    // 3. Baca dan validasi request.
    let body: { itemId?: unknown; imageUrls?: unknown };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Format permintaan tidak valid." },
        { status: 400 }
      );
    }

    const itemId = body.itemId;
    const imageUrls = body.imageUrls;
    const numericItemId = Number(itemId);

    if (
      !(
        (typeof itemId === "string" && itemId.trim().length > 0) ||
        (typeof itemId === "number" && Number.isFinite(itemId))
      ) ||
      !Number.isSafeInteger(numericItemId) ||
      numericItemId <= 0 ||
      !Array.isArray(imageUrls) ||
      imageUrls.some((url) => typeof url !== "string")
    ) {
      return NextResponse.json(
        { success: false, message: "Data cleanup tidak valid." },
        { status: 400 }
      );
    }

    // 4. Pastikan item yang diedit masih ada.
    const { data: currentItem, error: currentItemError } =
      await supabaseAdmin
        .from("items")
        .select("id")
        .eq("id", numericItemId)
        .maybeSingle();

    if (currentItemError || !currentItem) {
      return NextResponse.json(
        {
          success: false,
          message: "Item tidak ditemukan atau gagal diverifikasi.",
        },
        { status: 409 }
      );
    }

    const uniqueUrls = [
      ...new Set(
        (imageUrls as string[]).filter((url) => url.trim().length > 0)
      ),
    ];

    const deleted: string[] = [];
    const kept: string[] = [];
    const skipped: string[] = [];
    const failed: string[] = [];

    // 5. Periksa setiap gambar sebelum menghapusnya.
    for (const imageUrl of uniqueUrls) {
      const path = getItemImagePath(imageUrl);

      // URL eksternal dan bucket lain tidak disentuh.
      if (!path) {
        skipped.push(imageUrl);
        continue;
      }

      // Cari referensi pada kolom image_url milik item lain.
      const { data: singleRefs, error: singleError } =
        await supabaseAdmin
          .from("items")
          .select("id")
          .neq("id", numericItemId)
          .eq("image_url", imageUrl)
          .limit(1);

      // Cari referensi pada array image_urls milik item lain.
      const { data: arrayRefs, error: arrayError } =
        await supabaseAdmin
          .from("items")
          .select("id")
          .neq("id", numericItemId)
          .contains("image_urls", [imageUrl])
          .limit(1);

      // Jika pemeriksaan gagal, jangan menghapus gambar.
      if (singleError || arrayError) {
        console.error("Image reference check failed:", {
          path,
          singleError,
          arrayError,
        });

        failed.push(path);
        continue;
      }

      // Gambar yang digunakan item lain harus dipertahankan.
      if (
        (singleRefs?.length ?? 0) > 0 ||
        (arrayRefs?.length ?? 0) > 0
      ) {
        kept.push(path);
        continue;
      }

      // Periksa kembali apakah item yang sedang diedit masih
      // menggunakan URL tersebut.
      const {
        data: latestItem,
        error: latestItemError,
      } = await supabaseAdmin
        .from("items")
        .select("image_url, image_urls")
        .eq("id", numericItemId)
        .maybeSingle();

      if (latestItemError || !latestItem) {
        console.error("Current item verification failed:", {
          itemId: numericItemId,
          latestItemError,
        });

        failed.push(path);
        continue;
      }

      const stillUsedByCurrentItem =
        latestItem.image_url === imageUrl ||
        (Array.isArray(latestItem.image_urls) &&
          latestItem.image_urls.includes(imageUrl));

      if (stillUsedByCurrentItem) {
        kept.push(path);
        continue;
      }

      // Hapus hanya file yang sudah lolos pemeriksaan.
      const { error: removeError } = await supabaseAdmin.storage
        .from("item-images")
        .remove([path]);

      if (removeError) {
        console.error("Storage image deletion failed:", {
          path,
          removeError,
        });

        failed.push(path);
        continue;
      }

      deleted.push(path);
    }

    return NextResponse.json({
      success: failed.length === 0,
      deletedImages: deleted.length,
      keptImages: kept.length,
      skippedUrls: skipped.length,
      failedImages: failed.length,
      message:
        failed.length > 0
          ? "Sebagian gambar tidak dapat dibersihkan dan perlu diperiksa."
          : "Pemeriksaan dan cleanup gambar selesai.",
    });
  } catch (error) {
    console.error("Cleanup item images failed:", error);

    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
