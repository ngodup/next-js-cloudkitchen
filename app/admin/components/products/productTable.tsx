import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { IFoodItem } from "@/types";

interface ProductTableProps {
  foodItems: IFoodItem[];
  onEdit: (item: IFoodItem) => void;
  onDelete: (id: string) => void;
}

const ProductTable = ({ foodItems, onEdit, onDelete }: ProductTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Cuisine</TableHead>
          <TableHead>Repas</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead>Reviews</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {foodItems.map((item) => (
          <TableRow key={item._id}>
            <TableCell>
              <Image
                src={`/assets/images/${item.imageName}`}
                alt={item.name}
                width={50}
                height={40}
                className="w-full h-auto rounded-lg shadow-md"
              />
            </TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>€{item.price.toFixed(2)}</TableCell>
            <TableCell>{item.cuisine}</TableCell>
            <TableCell>{item.repas}</TableCell>
            <TableCell>{item.repasType}</TableCell>
            <TableCell>{item.rating?.toFixed(1) || "N/A"}</TableCell>
            <TableCell>{item.reviews || 0}</TableCell>
            <TableCell>{item.isActive ? "Active" : "Inactive"}</TableCell>
            <TableCell>
              <Button
                variant="outline"
                className="mr-2"
                onClick={() => onEdit(item)}
              >
                Edit
              </Button>
              <Button variant="destructive" onClick={() => onDelete(item._id!)}>
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProductTable;
