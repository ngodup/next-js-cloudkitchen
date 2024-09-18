import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { capitalizeFirstLetter, getStatusColors } from "@/lib/stringUtils";
import { IUserOrder } from "@/types";

interface OrdersTableProps {
  orders: IUserOrder[];
  handleStatusChange: (orderId: string, newStatus: string) => void;
}

const statusOptions = [
  "pending",
  "processing",
  "shipped",
  "completed",
  "delivered",
  "cancelled",
];

const OrdersTable = ({ orders, handleStatusChange }: OrdersTableProps) => {
  return (
    <Card>
      <Table>
        <TableHeader className="bg-primary m-0">
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
    </Card>
  );
};

export default OrdersTable;
