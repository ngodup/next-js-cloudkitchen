import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/lib/ApiResponse";
import { z } from "zod";
import { signUpSchema } from "@/schemas/signUpSchema";

export const authService = {
  signUp: async (data: z.infer<typeof signUpSchema>): Promise<ApiResponse> => {
    try {
      const response = await axios.post<ApiResponse>("/api/auth/sign-up", data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      throw new Error(
        axiosError.response?.data.message ||
          "There was a problem with your sign-up. Please try again."
      );
    }
  },

  checkUsernameUnique: async (username: string) => {
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_DOMAIN ||
        "https://tamo-cloudkitchen.vercel.app";
      const response = await fetch(
        `${baseUrl}/api/auth/check-username-unique`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check username");
      }

      const data = await response.json();
      return data.message; // Return just the message string
    } catch (error) {
      console.error("Error checking username:", error);
      throw new Error("Error checking username");
    }
  },

  forgotPassword: async (email: string): Promise<string> => {
    try {
      const response = await axios.post<ApiResponse>(
        `/api/auth/forgot-password`,
        { email }
      );
      return response.data.message;
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      throw new Error(
        axiosError.response?.data.message ??
          "Error processing forgot password request"
      );
    }
  },

  resetPassword: async (
    token: string,
    newPassword: string
  ): Promise<string> => {
    try {
      const response = await axios.post<ApiResponse>(
        `/api/auth/reset-password`,
        { token, newPassword }
      );
      return response.data.message;
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      throw new Error(
        axiosError.response?.data.message ?? "Error resetting password"
      );
    }
  },
};
