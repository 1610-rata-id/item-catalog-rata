"use client";

import {
  Copy,
  Mail,
  MessageCircle,
} from "lucide-react";

interface ShareMenuProps {
  open: boolean;
  shareUrl: string;
  itemName: string;
  theme: "dark" | "light";
  onClose: () => void;
}
export default function ShareMenu({
  open,
  shareUrl,
  itemName,
  theme,
  onClose,
}: ShareMenuProps) {
  if (!open) return null;

  async function copyLink() {
    await navigator.clipboard.writeText(
      shareUrl
    );

    alert("Link copied!");

    onClose();
  }

  function shareWhatsapp() {

  const text = encodeURIComponent(
`🦷 ITEM CATALOG RATA

Item:
${itemName}

View Catalog:
${shareUrl}

Shared from ITEM CATALOG RATA`
  );

  window.open(
    `https://wa.me/?text=${text}`,
    "_blank"
  );

  onClose();
}

  function shareEmail() {

  const subject =
    encodeURIComponent(
      `ITEM CATALOG RATA - ${itemName}`
    );

  const body =
    encodeURIComponent(
`Hello,

Please find the catalog item below.

Item:
${itemName}

Catalog Link:
${shareUrl}

Thank you.`
    );

  window.location.href =
    `mailto:?subject=${subject}&body=${body}`;

  onClose();
}

  return (
    <div
      className={`
  w-60

  rounded-2xl

  shadow-2xl

  overflow-hidden

  border

  ${
    theme === "dark"
      ? `
          bg-[#071d33]
          border-cyan-300/20
          text-white
        `
      : `
          bg-white
          border-slate-200
          text-slate-800
        `
  }
`}
    >

      <button
        onClick={copyLink}
        className={`
  w-full

  flex
  items-center
  gap-3

  px-5
  py-4

  transition

  ${
    theme === "dark"
      ? "hover:bg-cyan-500/10"
      : "hover:bg-slate-100"
  }
`}
      >
        <Copy size={18} />
        Copy Link
      </button>

      <button
        onClick={shareWhatsapp}
        className={`
  w-full

  flex
  items-center
  gap-3

  px-5
  py-4

  transition

  ${
    theme === "dark"
      ? "hover:bg-cyan-500/10"
      : "hover:bg-slate-100"
  }
`}
      >
        <MessageCircle size={18} />
        WhatsApp
      </button>

      <button
        onClick={shareEmail}
        className={`
  w-full

  flex
  items-center
  gap-3

  px-5
  py-4

  transition

  ${
    theme === "dark"
      ? "hover:bg-cyan-500/10"
      : "hover:bg-slate-100"
  }
`}
      >
        <Mail size={18} />
        Gmail
      </button>

    </div>
  );
}