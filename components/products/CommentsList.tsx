import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import { useToastNotification } from "@/hooks/useToastNotification";
import { IExtendComment } from "@/types";
import { commentService } from "@/services/commentService";
import Comment from "./Comment";
import CommentsSkeleton from "./CommentsSkeleton";

interface CommentsListProps {
  productId: string;
  refreshTrigger: number;
}

export default function CommentsList({
  productId,
  refreshTrigger,
}: CommentsListProps) {
  const [comments, setComments] = useState<IExtendComment[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const { successToast, errorToast } = useToastNotification();

  const fetchComments = async (pageNum: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const { comments: newComments, hasMore: moreComments } =
        await commentService.fetchProductComments(productId, pageNum, 5);
      setComments((prev) =>
        pageNum === 1 ? newComments : [...prev, ...newComments]
      );
      setHasMore(moreComments);
      setPage(pageNum);
    } catch (err) {
      setError("Failed to fetch comments. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments(1);
  }, [productId, refreshTrigger]);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      fetchComments(page + 1);
    }
  };

  const handleUpdateComment = async (
    commentId: string,
    content: string,
    rating: number | null
  ) => {
    try {
      await commentService.updateUserComment(commentId, { content, rating });
      setComments(
        comments.map((comment) =>
          comment._id === commentId ? { ...comment, content, rating } : comment
        )
      );
      successToast("Success", "Comment updated successfully");
    } catch (error) {
      errorToast("Error", "Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await commentService.deleteUserComment(commentId);
        setComments(comments.filter((comment) => comment._id !== commentId));
        successToast("Success", "Comment deleted successfully");
      } catch (error) {
        errorToast("Error", "Failed to delete comment");
      }
    }
  };

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto bg-red-50 border-red-200">
        <CardContent className="pt-6">
          <p className="text-red-500 text-center">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-popover-foreground flex items-center">
        <MessageSquare className="mr-2" /> Customer Reviews
      </h2>

      {comments.map((comment) => (
        <Comment
          key={comment._id}
          comment={comment}
          isOwnComment={session?.user?.email === comment.email}
          onEdit={handleUpdateComment}
          onDelete={handleDeleteComment}
        />
      ))}

      {isLoading && <CommentsSkeleton />}

      {hasMore && (
        <div className="text-center mt-4">
          <Button
            onClick={handleLoadMore}
            disabled={isLoading}
            variant="outline"
            className="text-primary hover:text-primary-foreground hover:bg-primary"
          >
            {isLoading ? "Loading..." : "Load More Reviews"}
          </Button>
        </div>
      )}

      {!hasMore && comments.length === 0 && (
        <Card className="mb-6 border-primary/10 shadow-sm">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No reviews yet. Be the first to review this product!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
