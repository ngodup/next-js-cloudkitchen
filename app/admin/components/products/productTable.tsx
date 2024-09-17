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
import { Card } from "@/components/ui/card";

interface ProductTableProps {
  foodItems: IFoodItem[];
  onEdit: (item: IFoodItem) => void;
  onDelete: (id: string) => void;
}

const ProductTable = ({ foodItems, onEdit, onDelete }: ProductTableProps) => {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow className="bg-primary">
            <TableHead className="text-white">Image</TableHead>
            <TableHead className="text-white">Name</TableHead>
            <TableHead className="text-white">Price</TableHead>
            <TableHead className="text-white">Cuisine</TableHead>
            <TableHead className="text-white">Repas</TableHead>
            <TableHead className="text-white">Type</TableHead>
            <TableHead className="text-white">Rating</TableHead>
            <TableHead className="text-white">Reviews</TableHead>
            <TableHead className="text-white">Status</TableHead>
            <TableHead className="text-white">Actions</TableHead>
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
                <Button
                  variant="destructive"
                  onClick={() => onDelete(item._id!)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default ProductTable;
