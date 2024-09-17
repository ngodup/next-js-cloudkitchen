"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Search, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
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
import { capitalizeFirstLetter, getStatusColors } from "@/lib/stringUtils";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { IUserOrder } from "@/types";
const Orders = () => {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<IUserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("All Orders");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const tabs = ["All Orders", "Completed", "Pending", "Shipped", "Cancelled"];
  const statusOptions = [
    "pending",
    "processing",
    "shipped",
    "completed",
    "delivered",
    "cancelled",
  ];

  // Fetch orders dont add fetchOrders to useEffect if will cause infinite loop
  useEffect(() => {
    if (status === "authenticated" && session.user.role === "admin") {
      fetchOrders();
    } else if (status === "authenticated" && session.user.role !== "admin") {
      setError("You do not have permission to view this page.");
      setLoading(false);
    }
  }, [status, session, page, activeTab]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const status = activeTab === "All Orders" ? "" : activeTab.toLowerCase();
      const response = await axios.get(
        `/api/admin/orders?page=${page}&limit=12&status=${status}&search=${searchTerm}`
      );

      const { orders, pagination, success } = response.data;
      if (success && orders !== null) {
        setOrders(orders || []);
        if (pagination) {
          setTotalPages(pagination.totalPages);
        } else {
          toast({
            title: "Error",
            description: response.data.message || "Failed to fetch orders",
            variant: "destructive",
          });
        }
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        setError("You do not have permission to access this resource.");
      } else {
        setError("An error occurred while fetching your orders");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchOrders();
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await axios.patch(`/api/admin/orders/${orderId}`, {
        status: newStatus,
      });
      if (response.data.success) {
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        toast({
          title: "Status Updated",
          description: `Order status updated to ${capitalizeFirstLetter(
            newStatus
          )}`,
          className: "bg-primary text-white",
        });
      } else {
        throw new Error(
          response.data.message || "Failed to update order status"
        );
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
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
    <section className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Order Details</h1>

      <div className="flex space-x-2 mb-6">
        {tabs.map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </Button>
        ))}
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Search for order ID, username, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-96"
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      <Card>
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
                      <Select
                        value={order.status}
                        onValueChange={(value) =>
                          handleStatusChange(order._id, value)
                        }
                      >
                        <SelectTrigger
                          className={`w-[130px] bg-[rgb(${bg})] text-[rgb(${text})]`}
                        >
                          <SelectValue>
                            {capitalizeFirstLetter(order.status)}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status} value={status}>
                              {capitalizeFirstLetter(status)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>Credit Card</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-between items-center">
            <Button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span>
              Page {page} of {totalPages}
            </span>
            <Button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default Orders;
