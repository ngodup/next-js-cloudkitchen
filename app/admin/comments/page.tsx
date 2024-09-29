"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { adminCommentService } from "@/services/admin/commentService";

import ErrorBoundary from "@/components/shared/ErrorBoundary";
import axios from "axios";
import CommentsTable, {
  ICommentUser,
} from "@/app/admin/components/comments/CommentsTable";
import EditCommentModal from "@/app/admin/components/comments/EditCommentModal";
import Pagination from "@/app/admin/components/shared/Pagination";
import SearchBar from "@/app/admin/components/shared/SearchBar";
import { useToastNotification } from "@/hooks/useToastNotification";
import { DeleteConfirmationDialog } from "@/components/shared/DeleteConfirmationDialog";

const Comments = () => {
  const { data: session, status } = useSession();
  const [comments, setComments] = useState<ICommentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { successToast, errorToast } = useToastNotification();

  const [editingComment, setEditingComment] = useState<ICommentUser | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<ICommentUser | null>(
    null
  );

  const fetchCommentsData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminCommentService.fetchComments(page, searchTerm);
      if (data.success && data.comments !== null) {
        setComments(data.comments || []);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages);
        }
      } else {
        throw new Error(data.message || "Failed to fetch comments");
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        setError("You do not have permission to access this resource.");
      } else {
        setError("An error occurred while fetching comments");
      }
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    if (status === "authenticated" && session.user.role === "admin") {
      fetchCommentsData();
    } else if (status === "authenticated" && session.user.role !== "admin") {
      setError("You do not have permission to view this page.");
      setLoading(false);
    }
  }, [status, session, fetchCommentsData]);

  const handleSearch = useCallback(() => {
    setPage(1);
    fetchCommentsData();
  }, [fetchCommentsData]);

  const handleEditComment = async (
    commentId: string,
    updatedData: Partial<{ content: string; rating: number | undefined }>
  ) => {
    try {
      const data = await adminCommentService.updateComment(
        commentId,
        updatedData
      );
      if (data.success) {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === commentId ? { ...comment, ...updatedData } : comment
          )
        );
        successToast("Comment", "updated successfully");
      } else {
        throw new Error(data.message || "Failed to update comment");
      }
    } catch (error) {
      errorToast("Error", "Failed to update comment");
    } finally {
      setEditingComment(null);
    }
  };

  const handleDeleteComment = (comment: ICommentUser) => {
    setCommentToDelete(comment);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (commentToDelete) {
      try {
        const data = await adminCommentService.deleteComment(
          commentToDelete._id
        );
        if (data.success) {
          setComments((prevComments) =>
            prevComments.filter(
              (comment) => comment._id !== commentToDelete._id
            )
          );
          successToast("Comment", "deleted successfully");
        } else {
          throw new Error(data.message || "Failed to delete comment");
        }
      } catch (error) {
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
    <ErrorBoundary>
      <section className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Comment Management</h1>
        <div className="mb-6">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            handleSearch={handleSearch}
          />
        </div>

        <CommentsTable
          comments={comments}
          onEdit={setEditingComment}
          onDelete={handleDeleteComment}
        />
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />

        {editingComment && (
          <EditCommentModal
            comment={editingComment}
            onClose={() => setEditingComment(null)}
            onEdit={handleEditComment}
          />
        )}

        <DeleteConfirmationDialog
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
          itemName={commentToDelete?.content || ""}
        />
      </section>
    </ErrorBoundary>
  );
};

export default Comments;
