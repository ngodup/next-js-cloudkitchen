"use client";

import { useState, useCallback } from "react";
import { IFoodItem } from "@/types";
import { adminProductService } from "@/services/admin/productService";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddFoodItemModal from "@/app/admin/components/products/AddFoodItemModal";
import EditFoodItemModal from "@/app/admin/components/products/EditFoodItemModal";
import CuisineFilter from "@/app/admin/components/products/CuisineFilter";
import Pagination from "@/app/admin/components/products/Pagination";
import SearchBar from "@/app/admin/components/products/SearchBar";
import ProductTable from "@/app/admin/components/products/ProductTable";
import { DeleteConfirmationDialog } from "@/components/shared/DeleteConfirmationDialog";
import { useToastNotification } from "@/hooks/useToastNotification";

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
  const { successToast, errorToast } = useToastNotification();

  const handleFetchProducts = useCallback(
    async (newPage: number, newCuisine: string, newSearch: string) => {
      try {
        const data = await adminProductService.fetchProducts(
          newPage,
          newCuisine,
          newSearch
        );
        setProducts(data.products);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        errorToast("Error", "Failed to fetch products");
      }
    },
    []
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
      await adminProductService.addFoodItem(newFoodItem);
      successToast("Success", "Food item added successfully");
      handleFetchProducts(page, activeCuisine, searchTerm);
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : "Failed to add food item";
      errorToast("Error", errMsg);
    } finally {
      setIsAddModalOpen(false);
    }
  };

  const handleEditFoodItem = async (updatedFoodItem: IFoodItem) => {
    try {
      await adminProductService.updateFoodItem(updatedFoodItem);
      successToast("Success", "Food item updated successfully");
      handleFetchProducts(page, activeCuisine, searchTerm);
    } catch (error) {
      errorToast("Error", "Failed to update food item");
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
        await adminProductService.deleteFoodItem(itemToDelete.id);
        successToast("Success", "Food item deleted successfully");
        handleFetchProducts(page, activeCuisine, searchTerm);
      } catch (error) {
        errorToast("Error", "Failed to delete food item");
      } finally {
        setDeleteDialogOpen(false);
        setItemToDelete(null);
      }
    }
  };

  return (
    <section className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lgmd:text-2xl font-bold mb-6">
          Food Item Management
        </h1>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="md:hidden flex"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <CuisineFilter
        activeCuisine={activeCuisine}
        setActiveCuisine={handleCuisineChange}
      />
      <div className="flex justify-between flex-wrap gap-2 items-center mb-6">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
        />

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="md:flex hidden"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
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
