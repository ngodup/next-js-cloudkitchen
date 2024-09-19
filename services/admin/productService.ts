// services/admin/productService.ts

import axios from "axios";
import { IFoodItem } from "@/types";

const API_URL = "/api/admin/products";

export const adminProductService = {
  fetchProducts: async (page: number, cuisine: string, search: string) => {
    try {
      const response = await axios.get(API_URL, {
        params: { page, cuisine, search },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  addFoodItem: async (newFoodItem: Omit<IFoodItem, "_id">) => {
    try {
      const response = await axios.post(API_URL, newFoodItem);
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || "Failed to add food item");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.message || "Failed to add food item"
        );
      }
      throw error;
    }
  },

  updateFoodItem: async (updatedFoodItem: IFoodItem) => {
    try {
      const response = await axios.put(
        `${API_URL}/${updatedFoodItem._id}`,
        updatedFoodItem
      );
      return response.data;
    } catch (error) {
      console.error("Error updating food item:", error);
      throw error;
    }
  },

  deleteFoodItem: async (foodItemId: string) => {
    try {
      const response = await axios.delete(`${API_URL}/${foodItemId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting food item:", error);
      throw error;
    }
  },
};
