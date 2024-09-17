import axios from "axios";
import { IFoodItem } from "@/types";

export const fetchProducts = async (
  page: number,
  cuisine: string,
  search: string
) => {
  try {
    const response = await axios.get(`/api/admin/products`, {
      params: { page, cuisine, search },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const addFoodItem = async (newFoodItem: Omit<IFoodItem, "_id">) => {
  try {
    const response = await axios.post("/api/admin/products", newFoodItem);
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to add food item");
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "Failed to add food item");
    }
    throw error;
  }
};

export const updateFoodItem = async (updatedFoodItem: IFoodItem) => {
  try {
    const response = await axios.put(
      `/api/admin/products/${updatedFoodItem._id}`,
      updatedFoodItem
    );
    return response.data;
  } catch (error) {
    console.error("Error updating food item:", error);
    throw error;
  }
};

export const deleteFoodItem = async (foodItemId: string) => {
  try {
    const response = await axios.delete(`/api/admin/products/${foodItemId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting food item:", error);
    throw error;
  }
};
