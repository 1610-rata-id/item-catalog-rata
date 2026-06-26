"use client";

import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";

import {
  TransformWrapper,
  TransformComponent,
} from "react-zoom-pan-pinch";

interface ImageViewerProps {
  open: boolean;
  image: string;
  images?: string[];
  onClose: () => void;
}

export default function ImageViewer({
  open,
  image,
  images = [],
  onClose,
}: ImageViewerProps) {

const [currentIndex, setCurrentIndex] =
  useState(
    Math.max(images.indexOf(image), 0)
  );

const currentImage =
  images.length > 0
    ? images[currentIndex]
    : image;

function showPrevious() {

  if (images.length <= 1) return;

  setCurrentIndex((prev) =>
    prev === 0
      ? images.length - 1
      : prev - 1
  );

}

function showNext() {

  if (images.length <= 1) return;

  setCurrentIndex((prev) =>
    prev === images.length - 1
      ? 0
      : prev + 1
  );

}

useEffect(() => {
  function handleKeyDown(
    e: KeyboardEvent
  ) {
    if (e.key === "Escape") {
      onClose();
    }
  }

  window.addEventListener(
    "keydown",
    handleKeyDown
  );

  return () =>
    window.removeEventListener(
      "keydown",
      handleKeyDown
    );
}, [onClose]);
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="
        fixed
        inset-0
        z-[9999]

        bg-black/90

        flex
        items-center
        justify-center

        p-8
      "
    >
      <div
  onClick={(e) => e.stopPropagation()}
  className="
    relative

    w-full
    h-full

    flex
    flex-col

    items-center
    justify-between
  "
>
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="
            absolute
            top-5
            right-5

            text-white

            z-50

            hover:scale-110
            transition
          "
        >
          <X size={34} />
        </button>

        {/* TOOLBAR akan dipindahkan ke dalam TransformWrapper */}

        <TransformWrapper
  initialScale={1}
  minScale={1}
  maxScale={5}
  wheel={{
    step: 0.2,
  }}
>
  {({
  zoomIn,
  zoomOut,
  resetTransform,
}) => (

    <>

      {/* IMAGE */}

      <div
  className="
    relative

    flex-1
    w-full

    flex
    items-center
    justify-center

    overflow-hidden
  "
>
       
        {/* PREVIOUS */}

      {images.length > 1 && (
  <button
    onClick={showPrevious}
    className="
      absolute
      left-20
top-1/2
-translate-y-1/2

      z-50

      w-12
      h-12

      rounded-full

      bg-black/60

      text-white

      hover:bg-black/80
      transition
    "
  >
    ◀
  </button>
)}

        <TransformComponent>

       

          <img
            src={currentImage}
            alt=""
            className="
              max-w-full
              max-h-full

              object-contain

              select-none
            "
          />

        </TransformComponent>

         {/* NEXT */}

       {images.length > 1 && (
  <button
    onClick={showNext}
    className="
      absolute
      right-20
top-1/2
-translate-y-1/2

      z-50

      w-12
      h-12

      rounded-full

      bg-black/60

      text-white

      hover:bg-black/80
      transition
    "
  >
    ▶
  </button>
)}

      </div>

      {/* TOOLBAR */}

      <div
        className="
          mb-6

          flex
          items-center
          gap-4

          bg-black/60
          backdrop-blur-xl

          rounded-full

          px-5
          py-3

          z-50
        "
      >

        <button
          onClick={() => zoomOut()}
        >
          <ZoomOut className="text-white" />
        </button>

        <span
  className="
    text-white
    w-16
    text-center
  "
>
  Zoom
</span>

        <button
          onClick={() => zoomIn()}
        >
          <ZoomIn className="text-white" />
        </button>

        <button
          onClick={() =>
            resetTransform()
          }
        >
          <RotateCcw className="text-white" />
        </button>

      </div>

        {/* THUMBNAIL */}

{images.length > 1 && (

  <div
    className="
      flex
      items-center
      justify-center

      gap-3

      py-4

      overflow-x-auto
    "
  >

    {images.map((img, index) => (

      <button
  key={index}
  onClick={() => {

    setCurrentIndex(index);

    resetTransform();

  }}
        className={`
          w-24
          h-24

          rounded-xl

          overflow-hidden

          border-2

          transition

          ${
            currentIndex === index
              ? "border-cyan-400 scale-110"
              : "border-transparent opacity-70 hover:opacity-100"
          }
        `}
      >

        <img
          src={img}
          alt=""
          className="
            w-full
            h-full

            object-cover
          "
        />

      </button>

    ))}

  </div>

)}

    </>

  )}

</TransformWrapper>
      </div>
    </div>
  );
}