"use client";

import React from "react";
import { useSidebar } from "@/hooks/useSidebar";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types";
import { Icons } from "@/components/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Category from "./category";
import { categories } from "@/constants/data";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { PriceRangeSlider } from "./price-range-slider";
import { useProductsContext } from "@/context/ProductsContext"; // Make sure this import is correct

interface DashboardNavProps {
  navItems: NavItem[];
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileNav?: boolean;
}
const DashboardNav = ({
  navItems,
  setOpen,
  isMobileNav = false,
}: DashboardNavProps) => {
  const { isMinimized } = useSidebar();
  const pathname = usePathname();
  const { status } = useSession();
  const {
    setCategories,
    setPriceRange,
    selectedCategories,
    priceRange: contextPriceRange,
  } = useProductsContext();

  const handleCategoryChange = (categories: string[]) => {
    setCategories(categories);
  };

  const handlePriceRangeChange = (newRange: number[]) => {
    setPriceRange(newRange);
  };

  const formatPrice = (value: number) => `€${value.toFixed(2)}`;

  // Filter nav items based on authentication status
  const filteredNavItems = navItems.filter((item) => {
    if (status === "authenticated") {
      return true; // Show all items for authenticated users
    } else {
      // Hide Account, Settings, and Orders for non-authenticated users
      return !["Account", "Settings", "Order", "Comments"].includes(item.title);
    }
  });

  return (
    <nav className="grid items-start gap-2">
      <TooltipProvider>
        {filteredNavItems.map((item, index) => {
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
      <Separator className="my-4" />
      {!isMinimized && (
        <>
          <Category
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
          />
          <Separator className="my-4" />
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">PRIX</h3>
            <PriceRangeSlider
              defaultValue={contextPriceRange}
              min={0}
              max={100} // Adjust as needed
              step={1}
              formatPrice={formatPrice}
              onValueCommit={handlePriceRangeChange}
            />
            <div className="flex justify-between text-sm">
              <span>{formatPrice(contextPriceRange[0])}</span>
              <span>{formatPrice(contextPriceRange[1])}</span>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default DashboardNav;
