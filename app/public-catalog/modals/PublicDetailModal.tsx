"use client";

import React from "react";
import { Share2 } from "lucide-react";
import ShareMenu from "@/app/components/catalog/ShareMenu";

interface PublicDetailModalProps {
  theme: "light" | "dark";

  selectedItem: any;

  setSelectedItem: React.Dispatch<any>;

  activeImage: string | null;

  setActiveImage: React.Dispatch<any>;

  showImageViewer: boolean;

  setShowImageViewer: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  showShareMenu: boolean;

  setShowShareMenu: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  shareUrl: string;
}

export default function PublicDetailModal(
  props: PublicDetailModalProps
) {
  const {
    theme,

    selectedItem,
    setSelectedItem,

    activeImage,
    setActiveImage,

    showImageViewer,
    setShowImageViewer,

    showShareMenu,
    setShowShareMenu,

    shareUrl,    

  } = props;

  return (

<>

{/* MODAL DETAIL */}
      {selectedItem && (

        <div
  className="
    fixed
    inset-0
    z-[9999]

    bg-black/70
    backdrop-blur-sm

    overflow-y-auto
    custom-scrollbar

    p-3
    md:p-4
  "
>

          <div
  className="
    min-h-screen

    flex

    items-start
    md:items-center

    justify-center

    py-6
    md:py-10
  "
>

            <div
  className={`
    w-full
    md:max-w-7xl
    rounded-3xl
    md:rounded-[32px]
    overflow-hidden
    relative
    shadow-2xl

    ${
      theme === "dark"
        ? `
          bg-[#071d33]
          text-white
        `
        : `
          bg-white
          text-slate-900
        `
    }
  `}
>

        {/* ACTION BUTTONS */}

<div
  className="
    absolute
    top-3
right-3
md:top-5
md:right-6
    z-50

    flex
    items-center
    gap-3
  "
>

  {/* SHARE */}

<button
  onClick={() =>
    setShowShareMenu(
      (prev) => !prev
    )
  }
  className={`
    w-10
h-10
md:w-11
md:h-11

    rounded-xl

    flex
    items-center
    justify-center

    transition

    ${
      theme === "dark"
        ? `
            bg-cyan-500/10
            border border-cyan-300/20
            text-cyan-300
          `
        : `
            bg-blue-50
            border border-blue-200
            text-blue-600
          `
    }

    hover:scale-105
  `}
>
  <Share2 size={20} />
</button>

{showShareMenu && (
  <div className="absolute top-12 md:top-16 right-0 z-[9999]">
    <ShareMenu
      open={showShareMenu}
      shareUrl={`${window.location.origin}/public-catalog/${selectedItem.slug}`}
      itemName={selectedItem.item_name}
      theme={theme}
      onClose={() =>
        setShowShareMenu(false)
      }
    />
  </div>
)}

  {/* CLOSE */}

  <button
    onClick={() => {

  setShowShareMenu(false);

  setSelectedItem(null);

}}
    className="
      text-4xl
      md:text-5xl
      font-light

      hover:text-red-500

      transition
    "
  >
    ×
  </button>

</div>

              <div
  className="
    flex
    flex-col

    md:grid
    md:grid-cols-2

    gap-6
    md:gap-10

    p-5
    md:p-10
  "
>

                {/* IMAGE */}
                <div>

                  <div
  className={`
    rounded-3xl
    p-4
    md:p-8
    flex
    items-center
    justify-center
    h-[260px]
    md:h-[500px]

    ${
      theme === "dark"
        ? "bg-[#0b2745]"
        : "bg-slate-50"
    }
  `}
>

                    {activeImage ? (
  <img
  src={activeImage}
  alt={selectedItem.item_name}
  onClick={() =>
    setShowImageViewer(true)
  }
  className="
    max-w-full
    max-h-full

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
      flex
      items-center
      justify-center
      w-full
      h-full
      text-slate-400
    "
  >
    No Image Available
  </div>
)}

                  </div>

                  {/* THUMB */}
                  <div
  className="
    flex

    gap-2
    md:gap-3

    mt-4

    overflow-x-auto

    pb-2

    custom-scrollbar
  "
>

                    {(
  selectedItem.image_urls &&
  selectedItem.image_urls.length > 0
    ? selectedItem.image_urls
    : selectedItem.image_url
      ? [selectedItem.image_url]
      : []
)
.map(
                      (
                        img: string,
                        index: number
                      ) => (

                        <img
                          key={index}
                          src={img}
                          onClick={() => {

  setShowShareMenu(false);

  setActiveImage(img);

}}
                          className={`
                            w-16
                            h-16
                            md:w-24
                            md:h-24
                            rounded-2xl
                            object-cover
                            border-2
                            cursor-pointer
                            transition
                            hover:scale-105
                            ${
                              activeImage === img
  ? "border-cyan-400"
  : theme === "dark"
    ? "border-cyan-300/20"
    : "border-slate-200"
                            }
                          `}
                        />

                      )
                    )}

                  </div>

                </div>

                {/* DETAIL */}
                <div className="pt-2 md:py-2">

                  <h1
                    className="
                      text-2xl
                      md:text-4xl
                      font-bold
                      leading-tight
                    "
                  >
                    {selectedItem.item_name}
                  </h1>

                  <p
  className={`
    mt-3
    text-sm
    md:text-lg

    ${
      theme === "dark"
        ? "text-cyan-300"
        : "text-blue-600"
    }
  `}
>
                    {selectedItem.category}
                  </p>

                  {/* INFO */}
                  <div className="
mt-6
md:mt-10

space-y-3
md:space-y-4

text-sm
md:text-base">

    <p>
    <span
  className="
    font-semibold
    opacity-80
  "
>
                        Code:
                      </span>{" "}
                      {selectedItem.item_code || "-"}
                    </p>

                    <p>
                      <span className="font-bold">
                        UOM:
                      </span>{" "}
                      {selectedItem.UOM || "-"}
                    </p>

                    <p>
                      <span className="font-bold">
                        Main Category:
                      </span>{" "}
                      {selectedItem.main_category || "-"}
                    </p>

                    <p>
                      <span className="font-bold">
                        Sub Category:
                      </span>{" "}
                      {selectedItem.sub_category || "-"}
                    </p>

                  </div>

                  {/* DESCRIPTION */}
                  <div className="mt-8
md:mt-12">

                    <h2
                      className="
                        text-xl
                        md:text-2xl
                        font-bold
                        mb-5
                      "
                    >
                      Description
                    </h2>

                    <div
  className={`
    whitespace-pre-line
    break-words
    leading-6
md:leading-8

text-sm
md:text-base

    ${
      theme === "dark"
        ? "text-white/80"
        : "text-slate-600"
    }
  `}
>
                      {selectedItem.description ||
                        "-"}
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      )}

</>

);

}

		