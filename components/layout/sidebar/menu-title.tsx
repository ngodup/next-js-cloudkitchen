"use client";

import { useSidebar } from "@/hooks/useSidebar";
import Image from "next/image";

const MenuTitle = () => {
  const { isMinimized } = useSidebar();

  // Calculate proportional height based on the width
  const width = isMinimized ? 60 : 100;
  const height = (width / 100) * 40; // Assuming the original aspect ratio is 100:40

  return (
    <div className="flex items-center gap-2">
      <Image
        src="/assets/images/main-logo.webp"
        alt="Cloud kitchen"
        width={width}
        height={height}
      />
      {!isMinimized && (
        <span className="text-sm text-primary md:font-bold">Tamo Kitchen</span>
      )}
    </div>
  );
};

export default MenuTitle;
