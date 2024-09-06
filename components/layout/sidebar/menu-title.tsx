"use client";

import { useSidebar } from "@/hooks/useSidebar";
import Image from "next/image";

const MenuTitle = () => {
  const { isMinimized } = useSidebar();

  // Define the maximum width for the image
  const maxWidth = isMinimized ? 60 : 100;

  // Assuming the original aspect ratio is 100:40
  const aspectRatio = 40 / 100;

  return (
    <div className="flex items-center gap-2">
      <div
        style={{
          width: `${maxWidth}px`,
          paddingBottom: `${maxWidth * aspectRatio}px`,
          position: "relative",
        }}
      >
        <Image
          src="/assets/images/main-logo.webp"
          alt="Cloud kitchen"
          fill
          style={{ objectFit: "contain" }}
          sizes={`${maxWidth}px`}
          priority
        />
      </div>
      {!isMinimized && (
        <span className="text-sm text-primary md:font-bold">Tamo Kitchen</span>
      )}
    </div>
  );
};

export default MenuTitle;
