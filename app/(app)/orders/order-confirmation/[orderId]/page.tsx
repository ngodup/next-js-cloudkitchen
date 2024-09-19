"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { IOrder } from "@/types";

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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/sign-in?redirect=/order-confirmation/" + orderId);
    } else if (status === "authenticated") {
      const fetchOrder = async () => {
        try {
          const response = await axios.get(`/api/orders/${orderId}`);
          if (response.data.success && response.data.order) {
            setOrder(response.data.order);
          } else {
            setError(response.data.message || "Failed to fetch order details");
          }
        } catch (err) {
          console.error("Error fetching order:", err);
          if (axios.isAxiosError(err)) {
            if (err.response?.status === 404) {
              setError("Order not found");
            } else if (err.response?.status === 403) {
              setError("You are not authorized to view this order");
            } else if (err.response?.status === 401) {
              setError("Please log in to view this order");
            } else {
              setError(
                err.response?.data?.message ||
                  "An error occurred while fetching the order"
              );
            }
          } else {
            setError("An unexpected error occurred");
          }
        } finally {
          setLoading(false);
        }
      };

      fetchOrder();
    }
  }, [orderId, router, status]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
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

  if (!order) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Not Found</AlertTitle>
        <AlertDescription>Order not found</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Order Confirmation</CardTitle>
          <CardDescription>Thank you for your order!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Order Number:</p>
              <p>{order._id}</p>
            </div>
            <div>
              <p className="font-semibold">Order Date:</p>
              <p>{new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="font-semibold">Order Status:</p>
              <Badge
                variant={order.status === "pending" ? "secondary" : "default"}
              >
                {order.status}
              </Badge>
            </div>
            <div>
              <p className="font-semibold">Total Items:</p>
              <p>{order.totalItems}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A summary of your order</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
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
                  <TableCell className="text-right">
                    ${(product.price * product.quantity).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Subtotal</p>
            <p className="text-sm text-muted-foreground">Shipping</p>
            <p className="text-sm text-muted-foreground">Tax</p>
            <p className="font-semibold">Total</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              ${order.totalPrice.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">$0.00</p>
            <p className="text-sm text-muted-foreground">Included</p>
            <p className="font-semibold">${order.totalPrice.toFixed(2)}</p>
          </div>
        </CardFooter>
      </Card>

      <Alert className="mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Order Confirmation Sent</AlertTitle>
        <AlertDescription>
          An email confirmation has been sent to your registered email address.
        </AlertDescription>
      </Alert>
    </div>
  );
}
