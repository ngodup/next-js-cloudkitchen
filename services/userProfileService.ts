import axios from "axios";
import { z } from "zod";
import { userProfileSchema } from "@/schemas/userProfileShcema";

export const userProfileService = {
  getUserProfile: async () => {
    try {
      const response = await axios.get("/api/user-profile");
      return response.data.userProfile;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  updateUserProfile: async (data: z.infer<typeof userProfileSchema>) => {
    try {
      const response = await axios.put("/api/user-profile", data);
      return response.data.userProfile;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  },

  getAddresses: async () => {
    try {
      const response = await axios.get("/api/addresses");
      return response.data.addresses;
    } catch (error) {
      console.error("Error fetching addresses:", error);
      throw error;
    }
  },

  addAddress: async (addressData: any) => {
    try {
      const response = await axios.post("/api/addresses", addressData);
      return response.data.address;
    } catch (error) {
      console.error("Error adding address:", error);
      throw error;
    }
  },
};
