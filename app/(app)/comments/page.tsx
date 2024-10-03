"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { commentService } from "@/services/commentService";
import { useToastNotification } from "@/hooks/useToastNotification";
import EditCommentDialog from "@/components/comments/EditCommentDialog";
import CommentsList from "@/components/comments/CommentsList";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ICommentWithProduct } from "@/types";
import { DeleteConfirmationDialog } from "@/components/shared/DeleteConfirmationDialog";
import exp from "constants";

const CommentsPage = () => {
  const [comments, setComments] = useState<ICommentWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingComment, setEditingComment] =
    useState<ICommentWithProduct | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] =
    useState<ICommentWithProduct | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();
  const { successToast, errorToast } = useToastNotification();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/sign-in?redirect=/comments");
    } else if (status === "authenticated") {
      fetchComments();
    }
  }, [status, router]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await commentService.fetchUserComments();

      if (data.success) {
        setComments(data.comments || []);
      } else {
        setError(data.message || "Failed to fetch comments");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while fetching your comments";
      setError(errorMessage);
      errorToast("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditComment = async (content: string, rating: number | null) => {
    if (!editingComment) return;

    try {
      const data = await commentService.updateUserComment(editingComment._id!, {
        content,
        rating,
      });
      if (data.success) {
        setComments(
          comments.map((comment) =>
            comment._id === editingComment._id
              ? { ...comment, content, rating }
              : comment
          )
        );
        successToast("Success", "Comment updated successfully");
      } else {
        throw new Error(data.message || "Failed to update comment");
      }
    } catch (err) {
      errorToast("Error", "Failed to update comment");
    } finally {
      setEditingComment(null);
    }
  };

  const handleDeleteComment = (comment: ICommentWithProduct) => {
    setCommentToDelete(comment);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (commentToDelete) {
      try {
        const data = await commentService.deleteUserComment(
          commentToDelete._id!
        );
        if (data.success) {
          setComments(
            comments.filter((comment) => comment._id !== commentToDelete._id)
          );
          successToast("Success", "Comment deleted successfully");
        } else {
          throw new Error(data.message || "Failed to delete comment");
        }
      } catch (err) {
        errorToast("Error", "Failed to delete comment");
      } finally {
        setDeleteDialogOpen(false);
        setCommentToDelete(null);
      }
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
      <h1 className="text-lg md:text-2xl font-bold mb-6">Your Comments</h1>
      <CommentsList
        comments={comments}
        onEdit={setEditingComment}
        onDelete={handleDeleteComment}
      />
      {editingComment && (
        <EditCommentDialog
          isOpen={!!editingComment}
          onClose={() => setEditingComment(null)}
          onEdit={handleEditComment}
          initialContent={editingComment.content}
          initialRating={editingComment.rating}
        />
      )}
      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        itemName="comment"
      />
    </div>
  );
};

export default CommentsPage;
