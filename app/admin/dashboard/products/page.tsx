"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Search, Filter, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import Image from "next/image";
import AddFoodItemModal from "../../components/AddFoodItemModal";
import EditFoodItemModal from "../../components/EditFoodItemModal";
import { IFoodItem } from "@/types";

const Page = () => {
  const { data: session, status } = useSession();
  const [foodItems, setFoodItems] = useState<IFoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeCuisine, setActiveCuisine] = useState("All Cuisines");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFoodItem, setEditingFoodItem] = useState<IFoodItem | null>(
    null
  );
  const { toast } = useToast();

  const cuisines = [
    "All Cuisines",
    "Indienne",
    "Française",
    "Japonaise",
    "Italienne",
    "Tibétaine",
    "Vietnamienne",
  ];

  // Fetch food items on page load and dont add fetchFoodItems to useEffect if will cause infinite loop
  useEffect(() => {
    if (status === "authenticated" && session.user.role === "admin") {
      fetchFoodItems();
    } else if (status === "authenticated" && session.user.role !== "admin") {
      setError("You do not have permission to view this page.");
      setLoading(false);
    }
  }, [status, session, page, activeCuisine]);

  const fetchFoodItems = async () => {
    try {
      setLoading(true);
      const cuisine =
        activeCuisine === "All Cuisines" ? "" : activeCuisine.toLowerCase();
      const response = await axios.get(
        `/api/admin/products?page=${page}&limit=12&cuisine=${cuisine}&search=${searchTerm}`
      );

      const { products, pagination, success } = response.data;
      if (success && products !== null) {
        setFoodItems(products);
        if (pagination) {
          setTotalPages(pagination.totalPages);
        }
      } else {
        toast({
          title: "Error",
          description: response.data.message || "Failed to fetch food items",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error fetching food items:", err);
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        setError("You do not have permission to access this resource.");
      } else {
        setError("An error occurred while fetching food items");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchFoodItems();
  };

  const handleAddFoodItem = async (newFoodItem: Omit<IFoodItem, "_id">) => {
    try {
      const response = await axios.post("/api/admin/food-items", newFoodItem);
      if (response.data.success) {
        toast({
          title: "Food Item Added",
          description: "The food item has been added successfully.",
        });
        fetchFoodItems();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add the food item.",
        variant: "destructive",
      });
    }
    setIsAddModalOpen(false);
  };

  const handleEditFoodItem = async (updatedFoodItem: IFoodItem) => {
    try {
      const response = await axios.put(
        `/api/admin/products/${updatedFoodItem._id}`,
        updatedFoodItem
      );
      if (response.data.success) {
        toast({
          title: "Food Item Updated",
          description: "The food item has been updated successfully.",
        });
        fetchFoodItems();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update the food item.",
        variant: "destructive",
      });
    }
    setEditingFoodItem(null);
  };

  const handleDeleteFoodItem = async (foodItemId: string) => {
    if (window.confirm("Are you sure you want to delete this food item?")) {
      try {
        const response = await axios.delete(
          `/api/admin/products/${foodItemId}`
        );
        if (response.data.success) {
          toast({
            title: "Food Item Deleted",
            description: "The food item has been deleted successfully.",
          });
          fetchFoodItems();
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete the food item.",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  // if (status === "loading") {
  //   return <Skeleton className="h-12 w-3/4" />;
  // }

  if (status === "unauthenticated") {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Please sign in to access this page.</AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <section className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Food Item Management</h1>

      <div className="flex space-x-2 mb-6">
        {cuisines.map((cuisine) => (
          <Button
            key={cuisine}
            variant={activeCuisine === cuisine ? "default" : "outline"}
            onClick={() => setActiveCuisine(cuisine)}
          >
            {cuisine}
          </Button>
        ))}
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Search for food item name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-96"
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Food Item
        </Button>
      </div>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Cuisine</TableHead>
                <TableHead>Repas</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Reviews</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {foodItems.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <Image
                      src={`/assets/images/${item.imageName}`}
                      alt={item.name}
                      width={50}
                      height={40}
                      className="w-full h-auto rounded-lg shadow-md"
                    />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>€{item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.cuisine}</TableCell>
                  <TableCell>{item.repas}</TableCell>
                  <TableCell>{item.repasType}</TableCell>
                  <TableCell>{item.rating?.toFixed(1) || "N/A"}</TableCell>
                  <TableCell>{item.reviews || 0}</TableCell>
                  <TableCell>{item.isActive ? "Active" : "Inactive"}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      className="mr-2"
                      onClick={() => setEditingFoodItem(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteFoodItem(item._id!)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-between items-center">
            <Button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span>
              Page {page} of {totalPages}
            </span>
            <Button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>

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
    </section>
  );
};

export default Page;
