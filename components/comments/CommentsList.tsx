import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import CommentCard from "./CommentCard";
import { ICommentWithProduct } from "@/types";

interface CommentsListProps {
  comments: ICommentWithProduct[];
  onEdit: (comment: ICommentWithProduct) => void;
  onDelete: (comment: ICommentWithProduct) => void;
}

const CommentsList = ({ comments, onEdit, onDelete }: CommentsListProps) => {
  if (comments.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Comments Found</AlertTitle>
        <AlertDescription>
          You haven&apos;t made any comments yet.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {comments.map((comment) => (
        <CommentCard
          key={comment._id}
          comment={comment}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default CommentsList;
