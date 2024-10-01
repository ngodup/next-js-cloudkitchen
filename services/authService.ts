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

  checkUsernameUnique: async (username: string): Promise<string> => {
    try {
      const response = await axios.get<ApiResponse>(
        `/api/auth/check-username-unique?username=${username}`
      );
      return response.data.message;
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      throw new Error(
        axiosError.response?.data.message ?? "Error checking username"
      );
    }
  },

  forgotPassword: async (email: string): Promise<string> => {
    try {
      const response = await axios.post<ApiResponse>(
        `/api/auth/forgot-password`,
        { email }
      );
      debugger;
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
