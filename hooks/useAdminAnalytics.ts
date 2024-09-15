// hooks/useAdminAnalytics.ts

import axios from "axios";

export interface AnalyticsData {
  totalUsers: number;
  totalProducts: number;
  dailySales: number; // Changed from array to single number
  monthlySales: number; // Changed from array to single number
}

export async function fetchAdminAnalytics(): Promise<AnalyticsData> {
  const baseUrl = process.env.DOMAIN || "http://localhost:3000";

  try {
    const [totalUsersRes, totalProductsRes, dailySalesRes, monthlySalesRes] =
      await Promise.all([
        axios.get(`${baseUrl}/api/admin/analytics/total-users`),
        axios.get(`${baseUrl}/api/admin/analytics/total-products`),
        axios.get(`${baseUrl}/api/admin/analytics/daily-sell`),
        axios.get(`${baseUrl}/api/admin/analytics/monthly-sell`),
      ]);

    return {
      totalUsers: totalUsersRes.data.totalUsers,
      totalProducts: totalProductsRes.data.totalProducts,
      dailySales: dailySalesRes.data.totalSales, // Changed to match new API response
      monthlySales: monthlySalesRes.data.totalSales, // Changed to match new API response
    };
  } catch (error) {
    console.error("Failed to fetch analytics data:", error);
    throw new Error("Failed to fetch analytics data");
  }
}
