"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { menuCategories } from "@/constants/data";
import MenuCuisineItem from "./menu-cuisine";
import ProductCard from "./product-card";
import { IFoodItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HomePageClientProps {
  initialData: {
    success: boolean;
    message: string;
    products: IFoodItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalProducts: number;
    };
  };
}

export default function HomePageClient({ initialData }: HomePageClientProps) {
  const [products, setProducts] = useState<IFoodItem[]>(initialData.products);
  const [currentPage, setCurrentPage] = useState(
    initialData.pagination.currentPage
  );
  const [totalPages, setTotalPages] = useState(
    initialData.pagination.totalPages
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(!initialData.success);
  const [errorMessage, setErrorMessage] = useState(initialData.message);

  const fetchProducts = async (page: number) => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await axios.get("/api/products", {
        params: { page, limit: 12 },
      });
      setProducts(response.data.products);
      setCurrentPage(response.data.pagination.currentPage);
      setTotalPages(response.data.pagination.totalPages);
      setErrorMessage("");
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setIsError(true);
      setErrorMessage("Unable to load products. Please try again later.");
      // Keep the current products and pagination state
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (products.length === 0 && !isError) {
      fetchProducts(1);
    }
  }, []);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchProducts(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      fetchProducts(currentPage - 1);
    }
  };

  const renderPagination = () => (
    <div className="mt-8 flex justify-between items-center w-full">
      <Button
        onClick={handlePrevPage}
        disabled={currentPage === 1 || isLoading}
        variant="outline"
        size="sm"
        className="text-primary hover:text-primary-foreground hover:bg-primary"
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        onClick={handleNextPage}
        disabled={currentPage === totalPages || isLoading}
        variant="outline"
        size="sm"
        className="text-primary hover:text-primary-foreground hover:bg-primary"
      >
        Next <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <div className="flex flex-wrap gap-2 mb-6">
          {menuCategories.map((menu, index) => (
            <MenuCuisineItem key={index} menu={menu} />
          ))}
        </div>

        {isLoading ? (
          <ProductsSkeleton />
        ) : products.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} food={product} />
            ))}
          </div>
        ) : (
          <Card className="mb-6 border-primary/10 shadow-sm">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                {errorMessage || "No products available at the moment."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {totalPages > 1 && <CardFooter>{renderPagination()}</CardFooter>}
    </div>
  );
}

function ProductsSkeleton() {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
        <Card key={n} className="shadow-sm">
          <CardContent className="pt-6">
            <Skeleton className="h-48 w-full mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
