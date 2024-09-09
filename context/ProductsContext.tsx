import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { useProducts } from "@/hooks/useProducts";
import { IFoodItem } from "@/types";
import { useDebounce } from "use-debounce";
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
  setPriceRange: (range: number[]) => void;
  setRepasType: (type: string) => void;
  searchTerm: string;
  selectedCategories: string[];
  priceRange: number[];
  repasType: string;
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
  const [priceRange, setPriceRange] = useState<number[]>([0, 100]);
  const [repasType, setRepasType] = useState("all");

  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [debouncedPriceRange] = useDebounce(priceRange, 300);
  const [debouncedCategories] = useDebounce(selectedCategories, 300);

  const fetchProducts = useCallback(
    async (params: any = {}) => {
      const updatedParams = {
        ...params,
        search: debouncedSearchTerm,
        categories: debouncedCategories,
        priceRange: `${debouncedPriceRange[0]}-${debouncedPriceRange[1]}`,
        repasType: repasType,
      };
      const fetchedProducts = await initialFetchProducts(updatedParams);
      setProducts(fetchedProducts);
    },
    [
      initialFetchProducts,
      debouncedSearchTerm,
      debouncedCategories,
      debouncedPriceRange,
      repasType,
    ]
  );

  //  fetch products on mount
  // Dont add fetchProducts to dependency array to avoid infinite loop
  useEffect(() => {
    fetchProducts({ page: 1, limit: 12 });
  }, [
    debouncedSearchTerm,
    debouncedCategories,
    debouncedPriceRange,
    repasType,
  ]);

  const setCategories = useCallback((categories: string[]) => {
    setSelectedCategories((prevCategories) => {
      const uniqueCategories = Array.from(new Set(categories));
      if (JSON.stringify(prevCategories) !== JSON.stringify(uniqueCategories)) {
        return uniqueCategories;
      }
      return prevCategories;
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      products,
      isLoading,
      error,
      pagination,
      fetchProducts,
      setSearchTerm,
      setCategories,
      setPriceRange,
      setRepasType,
      searchTerm,
      selectedCategories,
      priceRange,
      repasType,
    }),
    [
      products,
      isLoading,
      error,
      pagination,
      fetchProducts,
      searchTerm,
      selectedCategories,
      priceRange,
      repasType,
      setCategories,
    ]
  );

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
