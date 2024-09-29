import axios from "axios";

export const adminCommentService = {
  fetchComments: async (page: number, search: string) => {
    try {
      const response = await axios.get("/api/admin/comments", {
        params: { page, search },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching comments:", error);
      throw error;
    }
  },
  updateComment: async (
    commentId: string,
    updatedData: Partial<{ content: string; rating: number | undefined }>
  ) => {
    try {
      const response = await axios.patch(
        `/api/admin/comments/${commentId}`,
        updatedData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating comment:", error);
      throw error;
    }
  },

  deleteComment: async (commentId: string) => {
    try {
      const response = await axios.delete(`/api/admin/comments/${commentId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  },
};
