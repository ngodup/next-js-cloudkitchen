"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useProducts } from "@/hooks/useProducts";
import { IFoodItem } from "@/types";

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
}

interface ProductsContextType {
  products: IFoodItem[];
  isLoading: boolean;
  error: string | null;
  pagination: Pagination;
  fetchProducts: (params?: any) => Promise<void>;
  setSearchTerm: (term: string) => void;
  setCategories: (categories: string[]) => void;
  setPriceRange: (range: string) => void;
  searchTerm: string;
  selectedCategories: string[];
  priceRange: string;
}

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined
);

interface ProductsProviderProps {
  children: ReactNode;
  initialData: {
    products: IFoodItem[];
    pagination: Pagination;
  };
}

export const ProductsProvider: React.FC<ProductsProviderProps> = ({
  children,
  initialData,
}) => {
  const {
    products: initialProducts,
    fetchProducts: initialFetchProducts,
    isLoading,
    error,
    pagination,
  } = useProducts(initialData);

  const [products, setProducts] = useState<IFoodItem[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState("all");

  const fetchProducts = useCallback(
    async (params: any = {}) => {
      const updatedParams = {
        ...params,
        search: searchTerm,
        categories: selectedCategories,
        priceRange: priceRange,
      };
      const fetchedProducts = await initialFetchProducts(updatedParams);
      setProducts(fetchedProducts);
    },
    [initialFetchProducts, searchTerm, selectedCategories, priceRange]
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSetSearchTerm = (term: string) => {
    setSearchTerm(term);
    fetchProducts({ page: 1 }); // Reset to first page when search term changes
  };

  const handleSetCategories = (categories: string[]) => {
    setSelectedCategories(categories);
    fetchProducts({ page: 1 }); // Reset to first page when categories change
  };

  const handleSetPriceRange = (range: string) => {
    setPriceRange(range);
    fetchProducts({ page: 1 }); // Reset to first page when price range changes
  };

  const contextValue: ProductsContextType = {
    products,
    isLoading,
    error,
    pagination,
    fetchProducts,
    setSearchTerm: handleSetSearchTerm,
    setCategories: handleSetCategories,
    setPriceRange: handleSetPriceRange,
    searchTerm,
    selectedCategories,
    priceRange,
  };

  return (
    <ProductsContext.Provider value={contextValue}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProductsContext = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error(
      "useProductsContext must be used within a ProductsProvider"
    );
  }
  return context;
};
