"use client";

import { useSelector } from "react-redux";
import PageContainer from "@/components/layout/page-container";
import { menuCategories } from "@/constants/data";
import MenuCategoryItem from "./components/menu-category";
import { RootState } from "@/types";
import ProductCard from "./components/product-card";

export default function DashboardPage() {
  const products = useSelector((state: RootState) => state.products.products);

  return (
    <PageContainer scrollable={true}>
      <div>
        {/* Menu category cards */}
        <div className="flex flex-wrap gap-2">
          {menuCategories &&
            menuCategories.map((menu, index) => (
              <MenuCategoryItem key={index} menu={menu} />
            ))}
        </div>

        <div className="mt-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {products &&
              products.map((product, index) => (
                <ProductCard key={index} food={product} />
              ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
