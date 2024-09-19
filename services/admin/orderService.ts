import axios from "axios";

const API_URL = "/api/admin/orders";

export const adminOrderService = {
  fetchOrders: async (page: number, status: string, search: string) => {
    try {
      const response = await axios.get(API_URL, {
        params: { page, limit: 12, status, search },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  fetchLatestOrders: async (limit: number = 5) => {
    try {
      const response = await axios.get(`${API_URL}`, {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching latest orders:", error);
      throw error;
    }
  },

  updateOrderStatus: async (orderId: string, newStatus: string) => {
    try {
      const response = await axios.patch(`${API_URL}/${orderId}`, {
        status: newStatus,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },

  deleteOrder: async (orderId: string) => {
    try {
      const response = await axios.delete(`${API_URL}/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  },
};
