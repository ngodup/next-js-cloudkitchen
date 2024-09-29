// services/commentService.ts

import axios from "axios";
import { IExtendComment } from "@/types";

const API_URL = "/api";

export const commentService = {
  //Fetch comments for a product
  fetchProductComments: async (
    productId: string,
    page: number,
    limit: number
  ): Promise<{ comments: IExtendComment[]; hasMore: boolean }> => {
    try {
      const response = await axios.get(
        `${API_URL}/products/${productId}/comment`,
        {
          params: { page, limit },
        }
      );
      return {
        comments: response.data.comments,
        hasMore: response.data.comments.length === limit,
      };
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  },

  // Fetch comments made by the authenticated user
  fetchUserComments: async () => {
    try {
      const response = await axios.get(`${API_URL}/users/comments`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user comments:", error);
      throw error;
    }
  },

  createComment: async (commentData: {
    content: string;
    rating: number;
    productId: string;
  }) => {
    try {
      const response = await axios.post(`${API_URL}/comments`, commentData);
      return response.data;
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  },

  getUserComment: async (commentId: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/users/comments/${commentId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user comment:", error);
      throw error;
    }
  },

  updateUserComment: async (
    commentId: string,
    updateData: { content: string; rating: number | null }
  ) => {
    try {
      const response = await axios.patch(
        `${API_URL}/users/comments/${commentId}`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating comment:", error);
      throw error;
    }
  },

  deleteUserComment: async (commentId: string) => {
    try {
      const response = await axios.delete(
        `${API_URL}/users/comments/${commentId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  },
};
