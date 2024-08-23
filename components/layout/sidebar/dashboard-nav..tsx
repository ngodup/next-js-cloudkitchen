"use client";

import React from "react";
import { Dispatch, SetStateAction } from "react";
import { Icons } from "@/components/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSidebar } from "@/hooks/useSidebar";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardNavProps {
  navItems: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
}

const DashboardNav = ({
  navItems,
  setOpen,
  isMobileNav = false,
}: DashboardNavProps) => {
  const { isMinimized } = useSidebar();
  const pathname = usePathname();

  return (
    <nav className="grid items-start gap-2">
      <TooltipProvider>
        {navItems.map((item, index) => {
          const Icon = Icons[item.icon || "arrowRight"];
          return (
            item.href && (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.disabled ? "/" : item.href}
                    className={cn(
                      "flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                      pathname === item.href
                        ? "bg-primary text-white"
                        : "transparent",
                      item.disabled && "cursor-not-allowed opacity-80"
                    )}
                    onClick={() => {
                      if (setOpen) setOpen(false);
                    }}
                  >
                    <Icon className={`ml-3 size-5 flex-none`} />
                    {/* {!isMinimized && (
                      <span className="mr-2 truncate">{item.title}</span>
                    )} */}
                    {isMobileNav || (!isMinimized && !isMobileNav) ? (
                      <span className="mr-2 truncate">{item.title}</span>
                    ) : (
                      ""
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  align="center"
                  side="right"
                  sideOffset={8}
                  className={!isMinimized ? "hidden" : "inline-block"}
                >
                  {item.title}
                </TooltipContent>
              </Tooltip>
            )
          );
        })}
      </TooltipProvider>
    </nav>
  );
};

export default DashboardNav;
