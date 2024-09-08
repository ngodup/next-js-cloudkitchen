// hooks/useProducts.ts
import { useState, useCallback } from "react";
import axios from "axios";
import { IFoodItem } from "@/types";

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
}

interface UseProductsReturn {
  products: IFoodItem[];
  isLoading: boolean;
  error: string | null;
  pagination: Pagination;
  fetchProducts: (params: any) => Promise<IFoodItem[]>;
}

export const useProducts = (initialData: {
  products: IFoodItem[];
  pagination: Pagination;
}): UseProductsReturn => {
  const [products, setProducts] = useState<IFoodItem[]>(initialData.products);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>(
    initialData.pagination
  );

  const fetchProducts = useCallback(async (params: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/products", { params });
      setProducts(response.data.products);
      setPagination(response.data.pagination);
      return response.data.products;
    } catch (err) {
      setError("Failed to fetch products. Please try again.");
      console.error("Error in fetchProducts:", err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { products, isLoading, error, pagination, fetchProducts };
};
