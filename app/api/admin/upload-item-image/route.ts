import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MiB
const COMPRESSION_THRESHOLD = 200 * 1024; // 200 KiB
const MAX_INPUT_PIXELS = 40_000_000;
const BUCKET = "item-images";

const MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

async function removeNewUpload(filePath: string) {
  const { error } = await supabaseAdmin.storage.from(BUCKET).remove([filePath]);
  if (error) {
    console.error("Failed to remove newly uploaded unverified image:", {
      filePath,
      error,
    });
  }
}

export async function POST(request: Request) {
  let uploadedPath: string | null = null;

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return jsonError("Konfigurasi Supabase belum lengkap.", 500);
    }

    const authorization = request.headers.get("authorization");
    const token = authorization?.startsWith("Bearer ")
      ? authorization.slice(7)
      : "";

    if (!token) {
      return jsonError("Sesi tidak ditemukan. Silakan login kembali.", 401);
    }

    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const {
      data: { user },
      error: authError,
    } = await authClient.auth.getUser(token);

    if (authError || !user) {
      return jsonError("Sesi tidak valid. Silakan login kembali.", 401);
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("email", user.email ?? "")
      .maybeSingle();

    if (profileError) {
      console.error("Failed to verify upload role:", profileError);
      return jsonError("Gagal memverifikasi hak akses.", 500);
    }

    if (!profile || !["admin", "procurement"].includes(profile.role)) {
      return jsonError("Kamu tidak memiliki akses untuk mengunggah gambar.", 403);
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return jsonError("File gambar tidak ditemukan.", 400);
    }
    if (file.size === 0) {
      return jsonError("File gambar kosong.", 400);
    }
    if (file.size > MAX_FILE_SIZE) {
      return jsonError("Ukuran gambar maksimal 10 MiB.", 413);
    }
    if (!MIME_TYPES.has(file.type)) {
      return jsonError(
        "Format gambar tidak didukung. Gunakan JPEG, PNG, atau WebP.",
        400
      );
    }

    const originalBuffer = Buffer.from(await file.arrayBuffer());
    let metadata: Awaited<ReturnType<ReturnType<typeof sharp>["metadata"]>>;

    try {
      metadata = await sharp(originalBuffer, {
        limitInputPixels: MAX_INPUT_PIXELS,
      }).metadata();
    } catch {
      return jsonError("File gambar rusak atau tidak dapat dibaca.", 400);
    }

    const actualMimeByFormat: Record<string, string> = {
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
    };

    if (!metadata.format || actualMimeByFormat[metadata.format] !== file.type) {
      return jsonError("Format file tidak sesuai dengan isi gambar.", 400);
    }
    if (
      !metadata.width ||
      !metadata.height ||
      metadata.width * metadata.height > MAX_INPUT_PIXELS
    ) {
      return jsonError("Dimensi gambar terlalu besar atau tidak valid.", 400);
    }

    let outputBuffer: Buffer<ArrayBufferLike> = originalBuffer;
    let outputFormat = metadata.format;
    let compressed = false;

    if (file.size >= COMPRESSION_THRESHOLD) {
      try {
        const compressedBuffer = await sharp(originalBuffer, {
          limitInputPixels: MAX_INPUT_PIXELS,
        })
          .rotate()
          .webp({ quality: 82, effort: 6 })
          .toBuffer();

        if (compressedBuffer.length < originalBuffer.length) {
          // Validate the generated WebP before uploading it.
          const compressedMetadata = await sharp(compressedBuffer, {
            limitInputPixels: MAX_INPUT_PIXELS,
          }).metadata();

          if (compressedMetadata.format !== "webp") {
            throw new Error("Sharp did not produce a valid WebP image.");
          }

          outputBuffer = compressedBuffer;
          outputFormat = "webp";
          compressed = true;
        }
      } catch (error) {
        console.error("Image compression/validation failed:", error);
        return jsonError("Gagal memproses atau memverifikasi hasil kompresi gambar.", 422);
      }
    }

    const extensionByFormat: Record<string, string> = {
      jpeg: "jpg",
      png: "png",
      webp: "webp",
    };
    const extension = extensionByFormat[outputFormat];

    if (!extension) {
      return jsonError("Format gambar hasil tidak didukung.", 400);
    }

    const filePath = `catalog/${Date.now()}-${randomUUID()}.${extension}`;
    const contentType = actualMimeByFormat[outputFormat];

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(filePath, new Uint8Array(outputBuffer), {
        contentType,
        cacheControl: "31536000",
        upsert: false,
      });

    if (uploadError) {
      console.error("Image upload failed:", uploadError);
      return jsonError("Gagal mengunggah gambar ke penyimpanan.", 500);
    }
    uploadedPath = filePath;

    // Confirm the stored object can be downloaded and decoded as the expected format.
    const { data: storedFile, error: downloadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .download(filePath);

    if (downloadError || !storedFile) {
      console.error("Uploaded image download verification failed:", {
        filePath,
        error: downloadError,
      });
      await removeNewUpload(filePath);
      uploadedPath = null;
      return jsonError("Verifikasi gambar di Storage gagal. Silakan coba lagi.", 500);
    }

    const storedBuffer = Buffer.from(await storedFile.arrayBuffer());

    let storedMetadata: Awaited<ReturnType<ReturnType<typeof sharp>["metadata"]>>;
    try {
      storedMetadata = await sharp(storedBuffer, {
        limitInputPixels: MAX_INPUT_PIXELS,
      }).metadata();
    } catch (error) {
      console.error("Uploaded image cannot be decoded:", {
        filePath,
        actualBytes: storedBuffer.length,
        error,
      });
      await removeNewUpload(filePath);
      uploadedPath = null;
      return jsonError("Gambar yang tersimpan di Storage tidak dapat dibaca. Silakan coba lagi.", 500);
    }

    if (storedMetadata.format !== outputFormat) {
      console.error("Uploaded image format mismatch:", {
        filePath,
        expectedFormat: outputFormat,
        actualFormat: storedMetadata.format,
        expectedBytes: outputBuffer.length,
        actualBytes: storedBuffer.length,
      });
      await removeNewUpload(filePath);
      uploadedPath = null;
      return jsonError("Format gambar di Storage tidak sesuai. Silakan coba lagi.", 500);
    }

    const { data: publicUrlData } = await supabaseAdmin.storage
      .from(BUCKET)
      .getPublicUrl(filePath);

    uploadedPath = null; // Keep the verified file.
    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      path: filePath,
      originalSize: originalBuffer.length,
      uploadedSize: storedBuffer.length,
      compressed,
      format: outputFormat,
    });
  } catch (error) {
    console.error("Unexpected image upload error:", error);
    if (uploadedPath) {
      await removeNewUpload(uploadedPath);
    }
    return jsonError("Terjadi kesalahan saat mengunggah gambar.", 500);
  }
}
