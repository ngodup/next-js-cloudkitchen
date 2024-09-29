import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Edit, Trash } from "lucide-react";
import { IExtendComment } from "@/types";
import Rating from "../products/Rating";
import CommentEditForm from "./CommentEditForm";

interface CommentProps {
  comment: IExtendComment;
  isOwnComment: boolean;
  onEdit: (commentId: string, content: string, rating: number | null) => void;
  onDelete: (commentId: string) => void;
}

const Comment: React.FC<CommentProps> = ({
  comment,
  isOwnComment,
  onEdit,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const getInitials = (name: string, email: string) => {
    if (name && name.trim() !== "") {
      return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    } else if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return "??";
  };

  const handleEdit = (content: string, rating: number | null) => {
    onEdit(comment._id!, content, rating);
    setIsEditing(false);
  };

  return (
    <Card className="mb-6 border-primary/10 shadow-sm">
      <CardContent className="pt-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(comment.username, comment.email)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-popover-foreground">
                {comment.username}
              </p>
              <div className="flex items-center">
                {comment.rating && <Rating value={comment.rating} readOnly />}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {new Date(comment.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            {isEditing ? (
              <CommentEditForm
                initialContent={comment.content}
                initialRating={comment.rating || null}
                onSubmit={handleEdit}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <p className="mt-2 text-sm text-popover-foreground">
                {comment.content}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-2 flex items-center">
              <Mail className="mr-1 h-3 w-3" /> {comment.email}
            </p>
            {isOwnComment && !isEditing && (
              <div className="mt-2 space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="mr-1 h-3 w-3" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(comment._id!)}
                >
                  <Trash className="mr-1 h-3 w-3" /> Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Comment;
