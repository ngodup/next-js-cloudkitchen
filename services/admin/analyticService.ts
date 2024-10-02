import axios from "axios";

export interface AnalyticsData {
  totalUsers: number;
  totalProducts: number;
  dailySales: number;
  monthlySales: number;
}

export async function fetchAdminAnalytics(): Promise<AnalyticsData> {
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN;

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
      dailySales: dailySalesRes.data.totalSales,
      monthlySales: monthlySalesRes.data.totalSales,
    };
  } catch (error) {
    console.error("Failed to fetch analytics data:", error);
    throw new Error("Failed to fetch analytics data");
  }
}
