"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { adminOrderService } from "@/services/admin/orderService";
import { IUserOrder } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { capitalizeFirstLetter, getStatusColors } from "@/lib/stringUtils";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const LatestOrders = () => {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<IUserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    debugger;
    if (status === "authenticated" && session.user.role === "admin") {
      fetchOrders();
    } else if (status === "authenticated" && session.user.role !== "admin") {
      setError("You do not have permission to view this page.");
      setLoading(false);
    }
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await adminOrderService.fetchLatestOrders(5); // Fetch 5 latest orders
      if (data.success && data.orders) {
        setOrders(data.orders);
      } else {
        throw new Error(data.message || "Failed to fetch latest orders");
      }
    } catch (err) {
      setError("An error occurred while fetching the latest orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <section>
      <Card className="border-none">
        <CardHeader>
          <CardTitle>Latest Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-primary">
              <TableRow>
                <TableHead className="text-white">Customer</TableHead>
                <TableHead className="text-white">Order</TableHead>
                <TableHead className="text-white">Delivery Date</TableHead>
                <TableHead className="text-white">Delivery Pricing</TableHead>
                <TableHead className="text-white">Delivery Status</TableHead>
                <TableHead className="text-white">Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const { bg, text } = getStatusColors(order.status);
                return (
                  <TableRow key={order._id}>
                    <TableCell>
                      {order.user ? (
                        <>
                          <div>{order.user.username}</div>
                          <div className="text-sm text-gray-500">
                            {order.user.email}
                          </div>
                        </>
                      ) : (
                        "Unknown User"
                      )}
                    </TableCell>
                    <TableCell>
                      {order.products.map((p, index) => (
                        <p key={index}>
                          {p.name} x {p.quantity}
                        </p>
                      ))}
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>€{order.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium bg-[rgb(${bg})] text-[rgb(${text})]`}
                      >
                        {capitalizeFirstLetter(order.status)}
                      </span>
                    </TableCell>
                    <TableCell>Credit Card</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
};

export default LatestOrders;
