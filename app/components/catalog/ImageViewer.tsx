"use client";

import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
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
  const initialIndex = Math.max(images.indexOf(image), 0);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [rotation, setRotation] = useState(0);

  const currentImage = images.length > 0 ? images[currentIndex] : image;

  // Keep the selected image in sync when a different item is opened.
  useEffect(() => {
    setCurrentIndex(Math.max(images.indexOf(image), 0));
    setRotation(0);
  }, [image, images]);

  const showPrevious = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setRotation(0);
  }, [images.length]);

  const showNext = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setRotation(0);
  }, [images.length]);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") showPrevious();
      if (e.key === "ArrowRight") showNext();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose, showNext, showPrevious]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-3 sm:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex h-full min-h-0 w-full min-w-0 flex-col items-center gap-3"
      >
        <button
          onClick={onClose}
          aria-label="Close image viewer"
          className="absolute right-1 top-1 z-[60] rounded-full bg-black/60 p-2 text-white transition hover:bg-black/80 sm:right-2 sm:top-2"
        >
          <X size={30} />
        </button>

        <TransformWrapper
          key={currentImage}
          initialScale={1}
          minScale={1}
          maxScale={5}
          wheel={{ step: 0.2 }}
          doubleClick={{ mode: "toggle", step: 0.8 }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              {/* Flexible stage: the image uses available space without being cropped. */}
              <div className="relative flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden">
                {images.length > 1 && (
                  <button
                    onClick={showPrevious}
                    aria-label="Previous image"
                    className="absolute left-1 top-1/2 z-50 -translate-y-1/2 rounded-full bg-black/60 px-3 py-3 text-white transition hover:bg-black/85 sm:left-4"
                  >
                    ◀
                  </button>
                )}

                <TransformComponent
                  wrapperStyle={{
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                  }}
                  contentStyle={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={currentImage}
                    alt=""
                    draggable={false}
                    className="block select-none object-contain"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      width: "auto",
                      height: "auto",
                      objectFit: "contain",
                      transform: `rotate(${rotation}deg)`,
                      transformOrigin: "center center",
                    }}
                  />
                </TransformComponent>

                {images.length > 1 && (
                  <button
                    onClick={showNext}
                    aria-label="Next image"
                    className="absolute right-1 top-1/2 z-50 -translate-y-1/2 rounded-full bg-black/60 px-3 py-3 text-white transition hover:bg-black/85 sm:right-4"
                  >
                    ▶
                  </button>
                )}
              </div>

              {/* Controls remain outside the image stage so they do not shrink the image unpredictably. */}
              <div className="z-50 flex shrink-0 items-center justify-center gap-3 rounded-full border border-white/10 bg-black/70 px-4 py-2.5 text-white shadow-xl backdrop-blur-xl">
                <button onClick={() => zoomOut()} aria-label="Zoom out" className="rounded-full p-1 transition hover:bg-white/15">
                  <ZoomOut size={21} />
                </button>
                <span className="w-12 text-center text-xs sm:text-sm">Zoom</span>
                <button onClick={() => zoomIn()} aria-label="Zoom in" className="rounded-full p-1 transition hover:bg-white/15">
                  <ZoomIn size={21} />
                </button>
                <span className="mx-1 h-6 w-px bg-white/20" />
                <button
                  onClick={() => setRotation((prev) => (prev + 270) % 360)}
                  aria-label="Rotate left"
                  title="Rotate left"
                  className="rounded-full p-1 transition hover:bg-white/15"
                >
                  <RotateCcw size={20} />
                </button>
                <button
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  aria-label="Rotate right"
                  title="Rotate right"
                  className="rounded-full p-1 transition hover:bg-white/15"
                >
                  <RotateCw size={20} />
                </button>
                <button
                  onClick={() => {
                    setRotation(0);
                    resetTransform();
                  }}
                  aria-label="Reset image"
                  title="Reset zoom and rotation"
                  className="rounded-full px-2 py-1 text-xs transition hover:bg-white/15"
                >
                  Reset
                </button>
              </div>

              {images.length > 1 && (
                <div className="flex w-full shrink-0 items-center justify-center gap-2 overflow-x-auto px-2 py-2">
                  {images.map((img, index) => (
                    <button
                      key={`${img}-${index}`}
                      onClick={() => {
                        setCurrentIndex(index);
                        setRotation(0);
                        resetTransform();
                      }}
                      aria-label={`View image ${index + 1}`}
                      aria-current={currentIndex === index ? "true" : undefined}
                      className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition sm:h-16 sm:w-16 ${
                        currentIndex === index
                          ? "scale-105 border-cyan-400 opacity-100"
                          : "border-white/20 opacity-65 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-contain"
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
