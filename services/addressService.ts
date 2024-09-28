import axios from "axios";
import { IAddress } from "@/types";
import { AddressFormData } from "@/components/checkout/AddressForm";

export const addressService = {
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
      if (response.data.success && response.data.address) {
        return response.data.address;
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
      debugger;
      if (response.data.success && response.data.address) {
        return response.data.address;
      }
      throw new Error(response.data.message || "Failed to update address");
    } catch (error) {
      console.error("Error updating address:", error);
      throw error;
    }
  },
};
