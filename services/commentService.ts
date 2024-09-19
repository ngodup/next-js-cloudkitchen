// services/commentService.ts

import axios from "axios";
import { IExtendComment } from "@/types";

const API_URL = "/api/products";

export const commentService = {
  fetchComments: async (
    productId: string,
    page: number,
    limit: number
  ): Promise<{ comments: IExtendComment[]; hasMore: boolean }> => {
    try {
      const response = await axios.get(`${API_URL}/${productId}/comment`, {
        params: { page, limit },
      });
      return {
        comments: response.data.comments,
        hasMore: response.data.comments.length === limit,
      };
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  },

  // Add other comment-related API calls here as needed
};
