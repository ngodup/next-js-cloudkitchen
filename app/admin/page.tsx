import React from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AnalyticsData, fetchAdminAnalytics } from "@/hooks/useAdminAnalytics";
import InfoCard from "./components/InfoCard";
import Orders from "./components/Order";
import { weeklyVisiterOrders } from "@/constants/data";

const ChartComponent = dynamic(
  () => import("./components/Charts/ChartComponent"),
  {
    ssr: false,
  }
);

export default async function AdminDashboard() {
  let analyticsData: AnalyticsData;

  try {
    analyticsData = await fetchAdminAnalytics();
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return (
      <Card className="p-6 text-red-500">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p>Failed to load analytics data:</p>
        <p>{error instanceof Error ? error.message : String(error)}</p>
      </Card>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Analytics data on cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoCard title="Total Users" content={analyticsData.totalUsers} />
        <InfoCard
          title="Total Products"
          content={analyticsData.totalProducts}
        />
        <InfoCard
          title=" Daily Sales (24h)"
          content={analyticsData.dailySales.toFixed(2)}
          isCurrency
        />
        <InfoCard
          title="Monthly Sales (Current Month)"
          content={analyticsData.monthlySales.toFixed(2)}
          isCurrency
        />
      </div>

      {/* Latest order */}
      <div className="space-y-4">
        <Orders />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Recap</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartComponent data={weeklyVisiterOrders} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full">Add New Product</Button>
            <Button className="w-full">Process Refund</Button>
            <Button className="w-full">Update Inventory</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>New order received</li>
              <li>Low stock alert: Product XYZ</li>
              <li>New customer review</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
