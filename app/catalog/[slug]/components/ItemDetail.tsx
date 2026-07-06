"use client";

import DesktopDetail from "./DesktopDetail";
import MobileDetail from "./MobileDetail";

type ItemDetailProps = {
  data: any;
};

export default function ItemDetail({
  data,
}: ItemDetailProps) {
  return (
    <>
      {/* MOBILE */}
      <div className="block md:hidden">
        <MobileDetail
          data={data}
        />
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block">
        <DesktopDetail
          data={data}
        />
      </div>
    </>
  );
}