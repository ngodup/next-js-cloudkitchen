"use client";

import { useSidebar } from "@/hooks/useSidebar";
import Image from "next/image";

const MenuTitle = () => {
  const { isMinimized } = useSidebar();
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/assets/images/main-logo.webp"
        alt="Cloud kitchen"
        width={isMinimized ? 60 : 100} // Reduced size for minimized state
        height={isMinimized ? 40 : 40} // Keeping the height proportional
      />
      {!isMinimized && (
        <span className="text-sm text-primary md:font-bold">Tamo Kitchen</span>
      )}
    </div>
  );
};

export default MenuTitle;
