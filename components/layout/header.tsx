import React from "react";
import SearchInput from "@/app/(app)/components/search-input";
import ThemeToggle from "./themeToggle/theme-toggle";
import UserNav from "./user-nav";
import { cn } from "@/lib/utils";
import { MobileSidebar } from "./sidebar/mobile-sidebar";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { useProductsContext } from "@/context/ProductsContext";

export default function Header() {
  const { toggleCart, itemCount } = useCart();
  const { fetchProducts, setSearchTerm } = useProductsContext();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    fetchProducts({ page: 1, limit: 12 });
  };

  return (
    <header className="sticky inset-x-0 top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex items-center justify-between px-4 py-2">
        <div className={cn("block lg:!hidden")}>
          <MobileSidebar />
        </div>
        <div className="flex items-center gap-2 flex-1">
          <SearchInput
            placeholder="Search..."
            className="flex-grow"
            onChange={handleSearch}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCart}
            className="relative"
          >
            <ShoppingCart className="h-[1.2rem] w-[1.2rem]" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Button>
          <UserNav />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
