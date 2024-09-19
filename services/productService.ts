import axios from "axios";
import { IFoodItem } from "@/types";
import { ApiResponse } from "@/lib/ApiResponse";

const API_URL = "/api/products";

// Helper function to create API responses
export const productService = {
  getProductDetails: async (
    productId: string
  ): Promise<{ success: boolean; product?: IFoodItem; message?: string }> => {
    try {
      const response = await axios.get(`${API_URL}/${productId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching product details for product ${productId}:`,
        error
      );
      throw error;
    }
  },

  submitComment: async (
    productId: string,
    comment: string,
    rating: number,
    userId: string
  ): Promise<ApiResponse> => {
    try {
      const response = await axios.post<ApiResponse>(
        `${API_URL}/${productId}/comment`,
        {
          content: comment,
          rating,
          userId,
          productId,
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error submitting comment for product ${productId}:`,
        error
      );
      throw error;
    }
  },
};
