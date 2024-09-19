// services/orderService.ts

import axios from "axios";
import { IOrder } from "@/types";

const API_URL = "/api/orders";

export const orderService = {
  fetchOrders: async (): Promise<{
    success: boolean;
    orders?: IOrder[];
    message?: string;
  }> => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  getOrderDetails: async (
    orderId: string
  ): Promise<{ success: boolean; order?: IOrder; message?: string }> => {
    try {
      const response = await axios.get(`${API_URL}/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching order details for order ${orderId}:`,
        error
      );
      throw error;
    }
  },
};
