import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ICommentWithProduct } from "@/types";

interface CommentCardProps {
  comment: ICommentWithProduct;
  onEdit: (comment: ICommentWithProduct) => void;
  onDelete: (comment: ICommentWithProduct) => void;
}

const CommentCard = ({ comment, onEdit, onDelete }: CommentCardProps) => {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">
          Comment on {comment.product.name}
        </CardTitle>
        <CardDescription>
          Posted on {new Date(comment.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p>{comment.content}</p>
        {comment.rating !== null && (
          <Badge variant="secondary" className="mt-2">
            Rating: {comment.rating}
          </Badge>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => onEdit(comment)}>
          Edit
        </Button>
        <Button variant="destructive" onClick={() => onDelete(comment)}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CommentCard;
