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
import { Button } from "@/components/ui/button";
import { IComment } from "@/types";

export interface ICommentUser extends IComment {
  user: {
    username: string;
    email: string;
  };
  product: {
    name: string;
  };
}

interface CommentsTableProps {
  comments: ICommentUser[];
  onEdit: (comment: IComment) => void;
  onDelete: (comment: IComment) => void;
}

const CommentsTable = ({ comments, onEdit, onDelete }: CommentsTableProps) => {
  return (
    <Card>
      <Table>
        <TableHeader className="bg-primary m-0">
          <TableRow>
            <TableHead className="text-white">User</TableHead>
            <TableHead className="text-white">Product</TableHead>
            <TableHead className="text-white">Content</TableHead>
            <TableHead className="text-white">Rating</TableHead>
            <TableHead className="text-white">Date</TableHead>
            <TableHead className="text-white">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comments.map((comment) => (
            <TableRow key={comment._id}>
              <TableCell>{comment.user.username}</TableCell>
              <TableCell>{comment.product.name}</TableCell>
              <TableCell>{comment.content}</TableCell>
              <TableCell>{comment.rating}</TableCell>
              <TableCell>
                {new Date(comment.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  onClick={() => onEdit(comment)}
                  className="mr-2"
                >
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => onDelete(comment)}>
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

export default CommentsTable;
