import axios from "axios";
import { IOrder, IOrderProduct } from "@/types";

const API_URL = "/api/orders";

interface OrderResponse {
  success: boolean;
  message: string;
  order?: IOrder;
  clientSecret?: string;
}

interface OrdersResponse {
  success: boolean;
  message: string;
  orders?: IOrder[];
  totalOrders?: number;
  currentPage?: number;
  totalPages?: number;
}
export interface PaymentIntentResponse {
  clientSecret: string;
}

export const orderService = {
  createOrder: async (orderData: {
    products: IOrderProduct[];
    totalItems: number;
    totalPrice: number;
    addressId: string;
    paymentMethod: string;
  }): Promise<OrderResponse> => {
    try {
      const response = await axios.post<OrderResponse>(API_URL, orderData);
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  fetchOrders: async (
    page: number = 1,
    limit: number = 10
  ): Promise<OrdersResponse> => {
    try {
      const response = await axios.get<OrdersResponse>(
        `${API_URL}?page=${page}&limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  getOrderDetails: async (orderId: string): Promise<OrderResponse> => {
    try {
      const response = await axios.get<OrderResponse>(`${API_URL}/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching order details for order ${orderId}:`,
        error
      );
      throw error;
    }
  },

  updateOrderStatus: async (
    orderId: string,
    newStatus: string
  ): Promise<OrderResponse> => {
    try {
      const response = await axios.patch<OrderResponse>(
        `${API_URL}/${orderId}`,
        {
          status: newStatus,
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating order status for order ${orderId}:`, error);
      throw error;
    }
  },

  fetchPaymentIntent: async (
    paymentIntentId: string
  ): Promise<PaymentIntentResponse> => {
    try {
      const response = await axios.get<PaymentIntentResponse>(
        `/api/payment-intents/${paymentIntentId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching payment intent:", error);
      throw error;
    }
  },
};
