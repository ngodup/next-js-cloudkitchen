"use client";

import { useSidebar } from "@/hooks/useSidebar";
import Image from "next/image";
import { cn } from "@/lib/utils";

const MenuTitle = () => {
  const { isMinimized } = useSidebar();

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "relative",
          isMinimized ? "w-20 h-10 -left-6" : "w-40 h-20"
        )}
      >
        <Image
          src="/assets/images/main-logo.webp"
          alt="Cloud kitchen"
          fill
          className="object-contain"
          sizes={isMinimized ? "80px" : "160px"}
          priority
        />
      </div>
      {!isMinimized && (
        <span className="text-lg font-semibold text-primary">Tamo Kitchen</span>
      )}
    </div>
  );
};

export default MenuTitle;
