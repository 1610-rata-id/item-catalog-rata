"use client";

import {
  useEffect,
  useState,
} from "react";

import Image from "next/image";

import {
  ArrowLeft,
  Share2,
} from "lucide-react";

import ImageViewer from "@/app/components/catalog/ImageViewer";

import type { CatalogItem } from "@/types/catalog";

interface PublicMobileDetailProps {
  theme: "light" | "dark";

  selectedItem: CatalogItem;

  setSelectedItem: React.Dispatch<any>;
}

export default function PublicMobileDetail({
  theme,
  selectedItem,
  setSelectedItem,
}: PublicMobileDetailProps) {

  const images =
    selectedItem.image_urls &&
    selectedItem.image_urls.length > 0
      ? selectedItem.image_urls
      : selectedItem.image_url
      ? [selectedItem.image_url]
      : [];

  const [
    activeImage,
    setActiveImage,
  ] = useState(images[0] || "");

  const [
    showImageViewer,
    setShowImageViewer,
  ] = useState(false);


  async function handleShare() {

    const shareUrl =
  `${window.location.origin}/public-catalog/${selectedItem.slug}`;

    try {

      if (navigator.share) {

        await navigator.share({

  title: selectedItem.item_name,

  text: `Lihat item "${selectedItem.item_name}" di RATA Item Catalog`,

  url: shareUrl,

});

        return;

      }

      await navigator.clipboard.writeText(
        shareUrl
      );

      alert("Public catalog link copied.");

    } catch (err) {

      console.log(err);

    }

  }

  return (

    <main
  className={`
    fixed
    inset-0
    z-[9999]
    overflow-y-auto

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
              setSelectedItem(null)
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
  className={
    theme === "dark"
      ? "text-white"
      : "text-slate-700"
  }
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
  className={
    theme === "dark"
      ? "text-white"
      : "text-slate-700"
  }
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
                  selectedItem.item_name
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
    {selectedItem.category}
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
    {selectedItem.item_name}
  </h1>

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
      label="Item Code"
      value={selectedItem.item_code}
    />

    <InfoRow
      theme={theme}
      label="UOM"
      value={selectedItem.UOM}
    />

<InfoRow
  theme={theme}
  label="Main Category"
  value={selectedItem.main_category}
/>

<InfoRow
  theme={theme}
  label="Sub Category"
  value={selectedItem.sub_category}
/>

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
    {selectedItem.description || "-"}
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