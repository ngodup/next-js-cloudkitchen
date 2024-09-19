import axios from "axios";
import { IAddress, IOrderProduct } from "@/types";
import { AddressFormData } from "@/components/checkout/AddressForm";

export const checkoutService = {
  fetchAddresses: async (): Promise<IAddress[]> => {
    try {
      const response = await axios.get("/api/addresses");
      if (response.data.success && response.data.addresses) {
        return response.data.addresses;
      }
      throw new Error("Failed to fetch addresses");
    } catch (error) {
      console.error("Error fetching addresses:", error);
      throw error;
    }
  },

  addAddress: async (data: AddressFormData): Promise<IAddress> => {
    try {
      const response = await axios.post("/api/addresses", data);
      if (response.data.success && response.data.addresss) {
        return response.data.addresss;
      }
      throw new Error(response.data.message || "Failed to save address");
    } catch (error) {
      console.error("Error adding address:", error);
      throw error;
    }
  },

  updateAddress: async (
    addressId: string,
    data: AddressFormData
  ): Promise<IAddress> => {
    try {
      const response = await axios.put(`/api/addresses`, {
        addressId,
        ...data,
      });
      if (response.data.success && response.data.addresss) {
        return response.data.addresss;
      }
      throw new Error(response.data.message || "Failed to update address");
    } catch (error) {
      console.error("Error updating address:", error);
      throw error;
    }
  },

  createOrder: async (orderData: {
    products: IOrderProduct[];
    totalItems: number;
    totalPrice: number;
    addressId: string;
    paymentMethod: string;
  }) => {
    try {
      const response = await axios.post("/api/orders", orderData);
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },
};
