"use client";

import ImageViewer from "@/app/components/catalog/ImageViewer";

interface PublicImageViewerProps {
  open: boolean;

  image: string;

  images: string[];

  onClose: () => void;
}

export default function PublicImageViewer({
  open,
  image,
  images,
  onClose,
}: PublicImageViewerProps) {
  return (
    <ImageViewer
      open={open}
      image={image}
      images={images}
      onClose={onClose}
    />
  );
}