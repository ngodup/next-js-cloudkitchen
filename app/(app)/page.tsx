"use client";

import { useSelector } from "react-redux";
import PageContainer from "@/components/layout/page-container";
import { menuCategories } from "@/constants/data";
import MenuCuisineItem from "./components/menu-cuisine";
import { RootState } from "@/types";
import ProductCard from "./components/product-card";
import { useEffect } from "react";
import { fetchProducts } from "@/store/products/products-slice";
import { useAppDispatch } from "@/store";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { products, status, error } = useSelector(
    (state: RootState) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <PageContainer scrollable={true}>
      <div>
        {/* Menu category cards */}
        <div className="flex flex-wrap gap-2">
          {menuCategories &&
            menuCategories.map((menu, index) => (
              <MenuCuisineItem key={index} menu={menu} />
            ))}
        </div>

        {/* Conditional rendering for loading and error states */}
        {status === "loading" && (
          <Card className="w-full p-10">Loading...</Card>
        )}
        {status === "failed" && (
          <Card className="w-full p-10">Error: {error}</Card>
        )}

        {/* Product cards */}
        {status === "idle" && (
          <div className="mt-5">
            <div className="grid gap-x-2 gap-y-6 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
              {products &&
                products.map((product) => (
                  <ProductCard key={product._id} food={product} />
                ))}
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
