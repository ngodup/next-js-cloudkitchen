"use client";

import { useState, useCallback } from "react";
import { IFoodItem } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import {
  fetchProducts,
  addFoodItem,
  updateFoodItem,
  deleteFoodItem,
} from "./productsApi";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddFoodItemModal from "@/app/admin/components/products/AddFoodItemModal";
import EditFoodItemModal from "@/app/admin/components/products/EditFoodItemModal";
import CuisineFilter from "@/app/admin/components/products/CuisineFilter";
import Pagination from "@/app/admin/components/products/Pagination";

import SearchBar from "@/app/admin/components/products/SearchBar";
import ProductTable from "@/app/admin/components/products/ProductTable";
import { DeleteConfirmationDialog } from "@/components/customUI/DeleteConfirmationDialog";

interface ProductsClientProps {
  initialData: {
    products: IFoodItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalProducts: number;
    };
  };
}

export default function ProductsClient({ initialData }: ProductsClientProps) {
  const [products, setProducts] = useState(initialData.products);
  const [page, setPage] = useState(initialData.pagination.currentPage);
  const [totalPages, setTotalPages] = useState(
    initialData.pagination.totalPages
  );

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [activeCuisine, setActiveCuisine] = useState("All Cuisines");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFoodItem, setEditingFoodItem] = useState<IFoodItem | null>(
    null
  );
  const { toast } = useToast();

  const handleFetchProducts = useCallback(
    async (newPage: number, newCuisine: string, newSearch: string) => {
      try {
        const data = await fetchProducts(newPage, newCuisine, newSearch);
        setProducts(data.products);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch products",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      handleFetchProducts(newPage, activeCuisine, searchTerm);
    },
    [activeCuisine, searchTerm, handleFetchProducts]
  );

  const handleCuisineChange = useCallback(
    (newCuisine: string) => {
      setActiveCuisine(newCuisine);
      setPage(1);
      handleFetchProducts(1, newCuisine, searchTerm);
    },
    [searchTerm, handleFetchProducts]
  );

  const handleSearch = useCallback(() => {
    setPage(1);
    handleFetchProducts(1, activeCuisine, searchTerm);
  }, [activeCuisine, searchTerm, handleFetchProducts]);

  const handleAddFoodItem = async (newFoodItem: Omit<IFoodItem, "_id">) => {
    try {
      await addFoodItem(newFoodItem);
      toast({
        title: "Success",
        description: "Food item added successfully",
        className: "bg-primary text-primary-foreground",
      });
      handleFetchProducts(page, activeCuisine, searchTerm);
    } catch (error) {
      console.error("Error adding food item:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to add food item",
        variant: "destructive",
      });
    } finally {
      setIsAddModalOpen(false);
    }
  };

  const handleEditFoodItem = async (updatedFoodItem: IFoodItem) => {
    try {
      await updateFoodItem(updatedFoodItem);
      toast({
        title: "Success",
        description: "Food item updated successfully",
        className: "bg-primary text-primary-foreground",
      });
      handleFetchProducts(page, activeCuisine, searchTerm);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update food item",
        variant: "destructive",
      });
    } finally {
      setEditingFoodItem(null);
    }
  };

  const handleDeleteFoodItem = useCallback((foodItem: IFoodItem) => {
    setItemToDelete({ id: foodItem._id!, name: foodItem.name });
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteFoodItem(itemToDelete.id);
        toast({
          title: "Success",
          description: "Food item deleted successfully",
          className: "bg-primary text-primary-foreground",
        });
        handleFetchProducts(page, activeCuisine, searchTerm);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete food item",
          variant: "destructive",
        });
      } finally {
        setDeleteDialogOpen(false);
        setItemToDelete(null);
      }
    }
  };

  return (
    <section className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Food Item Management</h1>
      <CuisineFilter
        activeCuisine={activeCuisine}
        setActiveCuisine={handleCuisineChange}
      />
      <div className="flex justify-between items-center mb-6">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
        />
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Food Item
        </Button>
      </div>
      <ProductTable
        foodItems={products}
        onEdit={setEditingFoodItem}
        onDelete={handleDeleteFoodItem}
      />
      <Pagination
        page={page}
        totalPages={totalPages}
        setPage={handlePageChange}
      />
      {isAddModalOpen && (
        <AddFoodItemModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddFoodItem}
        />
      )}
      {editingFoodItem && (
        <EditFoodItemModal
          foodItem={editingFoodItem}
          onClose={() => setEditingFoodItem(null)}
          onEdit={handleEditFoodItem}
        />
      )}

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.name || ""}
      />
    </section>
  );
}
