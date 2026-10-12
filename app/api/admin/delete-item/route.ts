
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase-admin";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client ini hanya untuk memverifikasi access token pengguna.
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

    // Hanya izinkan URL dari project Supabase yang sama.
    if (image.origin !== projectUrl.origin) {
      return null;
    }

    if (!image.pathname.startsWith(marker)) {
      return null;
    }

    const encodedPath = image.pathname.slice(marker.length);
    const path = decodeURIComponent(encodedPath);

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
    // 1. Verifikasi identitas pengguna dari token Supabase.
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

    // 2. Periksa role dari database, bukan dari data yang dikirim browser.
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

    // 3. Validasi request. Penghapusan hanya diizinkan jika dryRun === false.
    let body: {
  id?: unknown;
  dryRun?: unknown;
  confirmDelete?: unknown;
};

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Format permintaan tidak valid." },
        { status: 400 }
      );
    }

    
const validId =
  (typeof body.id === "string" && body.id.trim().length > 0) ||
  (typeof body.id === "number" && Number.isFinite(body.id));

if (!validId) {
  return NextResponse.json(
    { success: false, message: "ID item tidak valid." },
    { status: 400 }
  );
}

const id = String(body.id).trim();

    // Dry-run remains the default. Real deletion requires BOTH an explicit
    // dryRun=false and a separate confirmDelete=true flag from an authenticated admin.
    const dryRun = body.dryRun !== false;
    const confirmDelete = body.confirmDelete === true;

    if (!dryRun && !confirmDelete) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Penghapusan nyata ditolak. Untuk menghapus, request harus menyertakan dryRun=false dan confirmDelete=true.",
        },
        { status: 400 }
      );
    }

    // 4. Ambil data item. Belum ada data yang dihapus pada tahap ini.
    const { data: item, error: itemError } = await supabaseAdmin
      .from("items")
      .select("*")
      .eq("id", id)
      .single();

    if (itemError || !item) {
      return NextResponse.json(
        { success: false, message: "Item tidak ditemukan." },
        { status: 404 }
      );
    }

    // 5. Kumpulkan URL gambar tanpa duplikasi.
    const imageUrls = [
      item.image_url,
      ...(Array.isArray(item.image_urls) ? item.image_urls : []),
    ].filter(
      (url): url is string =>
        typeof url === "string" && url.trim().length > 0
    );

    const uniqueUrls = [...new Set(imageUrls)];
    const imagesToDelete: string[] = [];
    const imagesKept: string[] = [];
    const imagesSkipped: string[] = [];
    const imageCheckFailures: string[] = [];

    // 6. Periksa referensi setiap gambar tanpa menghapusnya.
    for (const imageUrl of uniqueUrls) {
      const path = getItemImagePath(imageUrl);

      // URL eksternal atau URL di luar bucket item-images tidak disentuh.
      if (!path) {
        imagesSkipped.push("URL di luar bucket yang dikelola");
        continue;
      }

      const { data: singleImageRefs, error: singleImageError } =
        await supabaseAdmin
          .from("items")
          .select("id")
          .neq("id", id)
          .eq("image_url", imageUrl)
          .limit(1);

      const { data: multipleImageRefs, error: multipleImageError } =
        await supabaseAdmin
          .from("items")
          .select("id")
          .neq("id", id)
          .contains("image_urls", [imageUrl])
          .limit(1);

      // Jika pemeriksaan gagal, jangan menganggap gambar aman dihapus.
      if (singleImageError || multipleImageError) {
        console.error("Image reference check failed:", {
          imagePath: path,
          singleImageError,
          multipleImageError,
        });
        imageCheckFailures.push(path);
        continue;
      }

      if (
        (singleImageRefs?.length ?? 0) > 0 ||
        (multipleImageRefs?.length ?? 0) > 0
      ) {
        imagesKept.push(path);
        continue;
      }

      imagesToDelete.push(path);
    }

    // 7. Mode dry run berhenti di sini: tidak menghapus item atau gambar.
    if (dryRun) {
      return NextResponse.json({
        success: true,
        dryRun: true,
        item: {
          id: item.id,
          item_name: item.item_name,
        },
        report: {
          candidateImages: imagesToDelete.length,
          imagesStillUsed: imagesKept.length,
          skippedExternalOrUnsupportedUrls: imagesSkipped.length,
          referenceCheckFailures: imageCheckFailures.length,
          imagePathsToDelete: imagesToDelete,
          imagePathsStillUsed: imagesKept,
          imagePathsWithCheckFailures: imageCheckFailures,
        },
        message:
          imageCheckFailures.length > 0
            ? "Dry run selesai, tetapi ada gambar yang tidak dapat diverifikasi. Tidak ada data yang dihapus."
            : "Dry run selesai. Tidak ada item atau gambar yang dihapus.",
      });
    }

    // 8. Jika pemeriksaan referensi gambar gagal, batalkan sebelum menghapus item.
    // Ini menghindari penghapusan item ketika cleanup tidak dapat dinilai dengan aman.
    if (imageCheckFailures.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Penghapusan dibatalkan karena sebagian referensi gambar tidak dapat diverifikasi.",
          failedChecks: imageCheckFailures.length,
        },
        { status: 409 }
      );
    }

    // 9. Hapus item dari database hanya pada mode dryRun === false.
    const { error: deleteError } = await supabaseAdmin
      .from("items")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Delete item failed:", deleteError);

      return NextResponse.json(
        { success: false, message: "Item gagal dihapus dari database." },
        { status: 500 }
      );
    }

    // 10. Hapus hanya gambar yang sudah diverifikasi tidak dipakai item lain.
    let deletedImages = 0;
    let failedImages = 0;

    for (const path of imagesToDelete) {
      const { error: storageError } = await supabaseAdmin.storage
        .from("item-images")
        .remove([path]);

      if (storageError) {
        console.error("Storage image deletion failed:", {
          imagePath: path,
          storageError,
        });
        failedImages++;
        continue;
      }

      deletedImages++;
    }

    return NextResponse.json({
      success: true,
      dryRun: false,
      item,
      cleanup: {
        deletedImages,
        keptImages: imagesKept.length,
        failedImages,
        skippedExternalOrUnsupportedUrls: imagesSkipped.length,
      },
      message:
        failedImages > 0
          ? "Item terhapus, tetapi sebagian gambar belum berhasil dibersihkan."
          : "Item berhasil dihapus.",
    });
  } catch (error) {
    console.error("Delete item endpoint failed:", error);

    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
