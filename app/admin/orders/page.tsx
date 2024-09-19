"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { IUserOrder } from "@/types";
import { fetchOrders, updateOrderStatus } from "./ordersApi";

import ErrorBoundary from "@/components/shared/ErrorBoundary";
import axios from "axios";
import OrdersTable from "@/app/admin/components/orders/OrdersTable";
import StatusTabs from "@/app/admin/components/orders/StatusTabs";
import Pagination from "@/app/admin/components/products/Pagination";
import SearchBar from "@/app/admin/components/products/SearchBar";
import { useToastNotification } from "@/hooks/useToastNotification";

const Orders = () => {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<IUserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("All Orders");
  const [searchTerm, setSearchTerm] = useState("");
  const { successToast, errorToast } = useToastNotification();

  const fetchOrdersData = useCallback(async () => {
    try {
      setLoading(true);
      const status = activeTab === "All Orders" ? "" : activeTab.toLowerCase();
      const data = await fetchOrders(page, status, searchTerm);
      if (data.success && data.orders !== null) {
        setOrders(data.orders || []);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages);
        }
      } else {
        throw new Error(data.message || "Failed to fetch orders");
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
  }, [page, activeTab, searchTerm]);

  useEffect(() => {
    if (status === "authenticated" && session.user.role === "admin") {
      fetchOrdersData();
    } else if (status === "authenticated" && session.user.role !== "admin") {
      setError("You do not have permission to view this page.");
      setLoading(false);
    }
  }, [status, session, fetchOrdersData]);

  const handleSearch = useCallback(() => {
    setPage(1);
    fetchOrdersData();
  }, [fetchOrdersData]);

  const handleStatusChange = useCallback(
    async (orderId: string, newStatus: string) => {
      try {
        const data = await updateOrderStatus(orderId, newStatus);
        if (data.success) {
          setOrders((orders) =>
            orders.map((order) =>
              order._id === orderId ? { ...order, status: newStatus } : order
            )
          );
          successToast("Order status updated to", newStatus);
        } else {
          throw new Error(data.message || "Failed to update order status");
        }
      } catch (error) {
        errorToast("Error", "Failed to update order status");
      }
    },
    [] // Empty dependency array
  );

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
    <ErrorBoundary>
      <section className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Order Details</h1>
        <StatusTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mb-6">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearch={handleSearch}
          />
        </div>

        <OrdersTable orders={orders} handleStatusChange={handleStatusChange} />
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </section>
    </ErrorBoundary>
  );
};

export default Orders;
