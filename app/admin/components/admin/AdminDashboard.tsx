import React from "react";
import dynamic from "next/dynamic";
import { weeklyVisiterOrders } from "@/constants/data";
import { AnalyticsData } from "@/services/admin/analyticService";
import LatestOrders from "./LatestOrder";
import InfoCard from "./InfoCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ChartComponent = dynamic(
  () => import("../../components/Charts/ChartComponent"),
  {
    ssr: false,
  }
);

interface AdminDashboardProps {
  analyticsData: AnalyticsData | null;
  refetchData: () => Promise<void>;
}
export default function AdminDashboard({
  analyticsData,
  refetchData,
}: AdminDashboardProps) {
  if (!analyticsData) {
    return <Card className="p-4">No data available</Card>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Refresh button */}
      <Button onClick={refetchData} className="mb-4">
        Refresh Data
      </Button>

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
        <LatestOrders />
      </div>

      {/* Weekly recap records */}
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
