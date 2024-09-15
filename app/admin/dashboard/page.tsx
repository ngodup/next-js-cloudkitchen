import React from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnalyticsData, fetchAdminAnalytics } from "@/hooks/useAdminAnalytics";
import InfoCard from "../components/InfoCard";

const ChartComponent = dynamic(
  () => import("../components/Charts/ChartComponent"),
  {
    ssr: false,
  }
);

const data = [
  { name: "Mon", visits: 4000, orders: 2400 },
  { name: "Tue", visits: 3000, orders: 1398 },
  { name: "Wed", visits: 2000, orders: 9800 },
  { name: "Thu", visits: 2780, orders: 3908 },
  { name: "Fri", visits: 1890, orders: 4800 },
  { name: "Sat", visits: 2390, orders: 3800 },
  { name: "Sun", visits: 3490, orders: 4300 },
];

const orders = [
  {
    id: 1,
    customer: "John Doe",
    status: "Pending",
    date: "2024-09-14",
    amount: "€12",
  },
  {
    id: 2,
    customer: "Jane Smith",
    status: "Completed",
    date: "2024-09-14",
    amount: "€12",
  },
  {
    id: 3,
    customer: "Bob Johnson",
    status: "Cancelled",
    date: "2024-09-14",
    amount: "€12",
  },
  {
    id: 4,
    customer: "Alice Brown",
    status: "Pending",
    date: "2024-09-14",
    amount: "€12",
  },
];

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

      <Card>
        <CardHeader>
          <CardTitle>Latest Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-end">
            <Button>View All Orders</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Weekly Recap</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartComponent data={data} />
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
