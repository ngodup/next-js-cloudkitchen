"use client";

import React, { useEffect, useCallback } from "react";
import { menuCategories } from "@/constants/data";
import MenuCuisineItem from "./menu-cuisine";
import ProductCard from "./product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useProductsContext } from "@/context/ProductsContext";

export default function HomePageClient() {
  const {
    products,
    isLoading,
    error,
    pagination,
    fetchProducts,
    setRepasType,
    repasType,
  } = useProductsContext();

  const handleRepasTypeChange = useCallback(
    (type: string) => {
      setRepasType(type);
    },
    [setRepasType]
  );

  const handleNextPage = useCallback(() => {
    if (pagination.currentPage < pagination.totalPages) {
      fetchProducts({ page: pagination.currentPage + 1, limit: 12 });
    }
  }, [fetchProducts, pagination]);

  const handlePrevPage = useCallback(() => {
    if (pagination.currentPage > 1) {
      fetchProducts({ page: pagination.currentPage - 1, limit: 12 });
    }
  }, [fetchProducts, pagination]);

  useEffect(() => {
    if (products.length === 0 && !isLoading) {
      fetchProducts({ page: 1, limit: 12 });
    }
  }, []);

  const renderPagination = () => (
    <div className="mt-8 flex justify-between items-center w-full">
      <Button
        onClick={handlePrevPage}
        disabled={pagination.currentPage === 1 || isLoading}
        variant="outline"
        size="sm"
        className="text-primary hover:text-primary-foreground hover:bg-primary"
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {pagination.currentPage} of {pagination.totalPages}
      </span>
      <Button
        onClick={handleNextPage}
        disabled={pagination.currentPage === pagination.totalPages || isLoading}
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
            <MenuCuisineItem
              key={index}
              menu={menu}
              isActive={repasType === menu?.name}
              onClick={() => handleRepasTypeChange(menu.name)}
            />
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
                {error || "No products available at the moment."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <CardFooter>{renderPagination()}</CardFooter>
      )}
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
