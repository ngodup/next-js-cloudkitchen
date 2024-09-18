import axios from "axios";

export const fetchOrders = async (
  page: number,
  status: string,
  search: string
) => {
  try {
    const response = await axios.get(`/api/admin/orders`, {
      params: { page, limit: 12, status, search },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, newStatus: string) => {
  try {
    const response = await axios.patch(`/api/admin/orders/${orderId}`, {
      status: newStatus,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};
