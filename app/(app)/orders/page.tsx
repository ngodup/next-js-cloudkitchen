"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { IOrder } from "@/types";
import { orderService } from "@/services/orderService";
import { useToastNotification } from "@/hooks/useToastNotification";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const OrdersPage = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();
  const { errorToast } = useToastNotification();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/sign-in?redirect=/orders");
    } else if (status === "authenticated") {
      fetchOrders();
    }
  }, [status, router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.fetchOrders();

      if (data.success) {
        setOrders(data.orders || []);
      } else {
        setError(data.message || "Failed to fetch orders");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while fetching your orders";
      setError(errorMessage);
      errorToast("Error", errorMessage);
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      {orders.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Orders Found</AlertTitle>
          <AlertDescription>You havent placed any orders yet.</AlertDescription>
        </Alert>
      ) : (
        orders.map((order) => (
          <Card key={order._id} className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Order #{order._id}
              </CardTitle>
              <CardDescription>
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                <Badge
                  variant={order.status === "pending" ? "secondary" : "default"}
                >
                  {order.status}
                </Badge>
                <span>Total: ${order.totalPrice.toFixed(2)}</span>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.products.map((product) => (
                    <TableRow key={product.productId}>
                      <TableCell>
                        {product.imageName && (
                          <Image
                            src={`/assets/images/${product.imageName}`}
                            alt={product.name || "Product image"}
                            width={50}
                            height={50}
                            className="rounded-md"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {product.name || "Product Name Not Available"}
                      </TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Link href={`orders/order-confirmation/${order._id}`} passHref>
                <Button variant="outline">View Order Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};

export default OrdersPage;
