"use client";

import { useEffect, useState } from "react";
import { menuCategories } from "@/constants/data";
import MenuCuisineItem from "./menu-cuisine";
import ProductCard from "./product-card";
import axios from "axios";
import { IFoodItem } from "@/types";

export default function HomePageClient({
  initialProducts,
}: {
  initialProducts: IFoodItem[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);

  // Client-side effect to fetch products when the component mounts
  useEffect(() => {
    const fetchProductsClientSide = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/products", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Axios automatically parses JSON responses
        setProducts(res.data.products || []);
      } catch (error) {
        console.error("Error fetching products on client side:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsClientSide(); // Trigger the client-side fetch
  }, []);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {menuCategories.map((menu, index) => (
          <MenuCuisineItem key={index} menu={menu} />
        ))}
      </div>

      <div className="mt-5 grid gap-x-2 gap-y-6 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
        {loading ? (
          <div>Loading products...</div> // Optional loading state
        ) : products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product._id} food={product} />
          ))
        ) : (
          <div>No products available</div>
        )}
      </div>
    </div>
  );
}
