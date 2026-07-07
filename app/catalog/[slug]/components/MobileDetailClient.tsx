"use client";

import {
  useEffect,
  useState,
} from "react";

import Image from "next/image";

import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Share2,
} from "lucide-react";

import ImageViewer from "@/app/components/catalog/ImageViewer";

import type { CatalogItem } from "@/types/catalog";

type MobileDetailClientProps = {
  data: CatalogItem;
};

function formatRupiah(number: number) {
  return new Intl.NumberFormat(
    "id-ID"
  ).format(number || 0);
}

export default function MobileDetailClient({
  data,
}: MobileDetailClientProps) {

  const router = useRouter();

  const images =
    data.image_urls &&
    data.image_urls.length > 0
      ? data.image_urls
      : data.image_url
      ? [data.image_url]
      : [];

  const [
    activeImage,
    setActiveImage,
  ] = useState(images[0] || "");

  const [
    showImageViewer,
    setShowImageViewer,
  ] = useState(false);

  const [
    theme,
    setTheme,
  ] = useState<
    "light" | "dark"
  >("light");

  useEffect(() => {

    const saved =
      localStorage.getItem(
        "theme"
      );

    if (
      saved === "dark" ||
      saved === "light"
    ) {
      setTheme(saved);
    }

  }, []);

  async function handleShare() {

    const shareUrl =
      window.location.href;

    try {

      if (navigator.share) {

        await navigator.share({

          title:
            data.item_name,

          text:
            data.item_name,

          url: shareUrl,

        });

        return;

      }

      await navigator.clipboard.writeText(
        shareUrl
      );

      alert("Link copied.");

    } catch (err) {

      console.log(err);

    }

  }

  return (

    <main
      className={`
        min-h-screen

        ${
          theme === "dark"
            ? "bg-[#02111f]"
            : "bg-[#f5f7fb]"
        }
      `}
    >

      {/* HEADER */}

      <div
        className={`
          sticky
          top-0
          z-50

          border-b

          ${
            theme === "dark"
              ? `
                  bg-[#04192c]
                  border-cyan-400/10
                `
              : `
                  bg-white
                  border-slate-200
                `
          }
        `}
      >

        <div
          className="
            flex
            items-center
            justify-between

            px-4
            py-4
          "
        >

          <button
            onClick={() =>
              router.back()
            }
            className="
              w-10
              h-10

              flex
              items-center
              justify-center

              rounded-xl
            "
          >

            <ArrowLeft
              size={22}
            />

          </button>

          <button
            onClick={
              handleShare
            }
            className="
              w-10
              h-10

              flex
              items-center
              justify-center

              rounded-xl

              transition

              active:scale-95
            "
          >

            <Share2
              size={20}
            />

          </button>

        </div>

      </div>

      {/* CONTENT */}

      <div className="pb-12">

        {/* MAIN IMAGE */}

        <div
          className={
            theme === "dark"
              ? "bg-[#071d33]"
              : "bg-white"
          }
        >

          <div
            className="
              h-[320px]

              flex
              items-center
              justify-center

              p-8
            "
          >

            {activeImage ? (

              <Image
                src={activeImage}
                alt={
                  data.item_name
                }
                width={700}
                height={700}
                onClick={() =>
                  setShowImageViewer(
                    true
                  )
                }
                className="
                  max-h-full
                  w-auto

                  object-contain

                  cursor-zoom-in

                  transition-all
                  duration-300

                  hover:scale-105
                "
              />

            ) : (

              <div
                className="
                  text-slate-400
                "
              >
                No Image
              </div>

            )}

          </div>

        </div>

        {/* THUMBNAILS */}

     {images.length > 1 && (

  <div
    className="
      flex
      gap-3

      overflow-x-auto

      px-4
      py-4
    "
  >

    {images.map(
      (
        img,
        index
      ) => (

        <button
          key={index}
          onClick={() => {

            setActiveImage(img);

          }}
          className={`
            w-20
            h-20

            rounded-xl

            overflow-hidden

            border-2

            flex-shrink-0

            transition-all

            ${
              activeImage === img
                ? theme === "dark"
                  ? "border-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.25)]"
                  : "border-blue-600"
                : theme === "dark"
                ? "border-cyan-400/20"
                : "border-slate-200"
            }
          `}
        >

          <Image
            src={img}
            alt=""
            width={80}
            height={80}
            className="
              w-full
              h-full
              object-cover
            "
          />

        </button>

      )

    )}

  </div>

)}

{/* INFO */}

<div
  className="
    px-5
    py-6
  "
>

  <p
    className={
      theme === "dark"
        ? "text-gray-400 text-sm"
        : "text-slate-500 text-sm"
    }
  >
    {data.category}
  </p>

  <h1
    className={`
      mt-2

      text-2xl

      font-bold

      leading-tight

      ${
        theme === "dark"
          ? "text-white"
          : "text-slate-900"
      }
    `}
  >
    {data.item_name}
  </h1>

  <p
    className={`
      mt-4

      text-3xl

      font-bold

      ${
        theme === "dark"
          ? "text-cyan-300"
          : "text-green-600"
      }
    `}
  >
    Rp {formatRupiah(data.price)}
  </p>

  <div
    className={`
      mt-8

      space-y-4

      text-sm

      border-t

      pt-6

      ${
        theme === "dark"
          ? "border-cyan-400/10"
          : "border-slate-200"
      }
    `}
  >

    <InfoRow
      theme={theme}
      label="Vendor"
      value={data.vendor}
    />

    <InfoRow
      theme={theme}
      label="Item Code"
      value={data.item_code}
    />

    <InfoRow
      theme={theme}
      label="Manufacture"
      value={data.Manufacture}
    />

    <InfoRow
      theme={theme}
      label="UOM"
      value={data.UOM}
    />

    <InfoRow
      theme={theme}
      label="Type"
      value={data.type}
    />

    <InfoRow
      theme={theme}
      label="Term"
      value={data.Term}
    />

    <InfoRow
      theme={theme}
      label="Remarks"
      value={data.Remarks}
    />

  </div>

  {/* PURCHASE LINKS */}

<div className="mt-10">

  <h2
    className={`
      text-lg
      font-bold
      mb-4

      ${
        theme === "dark"
          ? "text-white"
          : "text-slate-900"
      }
    `}
  >
    Purchase Links
  </h2>

  <div className="space-y-3">

    {data.tokopedia_url && (
      <a
        href={data.tokopedia_url}
        target="_blank"
        rel="noopener noreferrer"
        className="
          block
          w-full

          rounded-2xl

          bg-green-600

          text-white

          text-center

          py-4

          font-semibold

          transition

          active:scale-95
        "
      >
        Tokopedia
      </a>
    )}

    {data.shopee_url && (
      <a
        href={data.shopee_url}
        target="_blank"
        rel="noopener noreferrer"
        className="
          block
          w-full

          rounded-2xl

          bg-orange-500

          text-white

          text-center

          py-4

          font-semibold

          transition

          active:scale-95
        "
      >
        Shopee
      </a>
    )}

    {data.whatsapp_url && (
      <a
        href={data.whatsapp_url}
        target="_blank"
        rel="noopener noreferrer"
        className="
          block
          w-full

          rounded-2xl

          bg-slate-900

          text-white

          text-center

          py-4

          font-semibold

          transition

          active:scale-95
        "
      >
        WhatsApp
      </a>
    )}

    {data.official_url && (
      <a
        href={data.official_url}
        target="_blank"
        rel="noopener noreferrer"
        className={`
          block
          w-full

          rounded-2xl

          border

          text-center

          py-4

          font-semibold

          transition

          active:scale-95

          ${
            theme === "dark"
              ? `
                  border-cyan-400/20
                  bg-cyan-500/10
                  text-cyan-300
                `
              : `
                  border-blue-200
                  bg-blue-50
                  text-blue-700
                `
          }
        `}
      >
        Official Website
      </a>
    )}

  </div>

</div>

{/* DESCRIPTION */}

<div className="mt-12">

  <h2
    className={`
      text-lg
      font-bold
      mb-4

      ${
        theme === "dark"
          ? "text-white"
          : "text-slate-900"
      }
    `}
  >
    Description
  </h2>

  <div
    className={`
      whitespace-pre-line

      leading-8

      ${
        theme === "dark"
          ? "text-white/70"
          : "text-slate-600"
      }
    `}
  >
    {data.description || "-"}
  </div>

</div>

        </div>

      </div>

      <ImageViewer
        open={showImageViewer}
        image={activeImage}
        images={images}
        onClose={() =>
          setShowImageViewer(false)
        }
      />

    </main>

  );

}

function InfoRow({
  theme,
  label,
  value,
}: {
  theme: "light" | "dark";
  label: string;
  value: string | null;
}) {
  return (

    <div
      className={`
        flex
        justify-between

        gap-5

        border-b

        pb-3

        ${
          theme === "dark"
            ? "border-cyan-400/10"
            : "border-slate-200"
        }
      `}
    >

      <span
        className={
          theme === "dark"
            ? "text-gray-400"
            : "text-slate-500"
        }
      >
        {label}
      </span>

      <span
        className={
          theme === "dark"
            ? "text-white font-medium text-right"
            : "text-slate-900 font-medium text-right"
        }
      >
        {value || "-"}
      </span>

    </div>

  );
}