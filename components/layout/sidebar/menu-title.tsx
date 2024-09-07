"use client";

import { useSidebar } from "@/hooks/useSidebar";
import Image from "next/image";

const MenuTitle = () => {
  const { isMinimized } = useSidebar();

  // Increase the maximum width for both states
  const maxWidth = isMinimized ? 80 : 160; // Increased from 60 and 120

  // Assuming the original aspect ratio is 100:40
  const aspectRatio = 50 / 100;

  return (
    <div className="flex items-center gap-2">
      <div
        style={{
          width: `${maxWidth}px`,
          height: `${maxWidth * aspectRatio}px`,
          position: "relative",
          left: isMinimized ? "-24px" : "0",
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
        <span className="text-lg text-primary font-semibold">Tamo Kitchen</span>
      )}
    </div>
  );
};

export default MenuTitle;
