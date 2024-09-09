import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Mail, Star } from "lucide-react";
import Rating from "./rating";
import { IComment } from "@/types";

interface IExtendComment extends IComment {
  username: string;
  email: string;
}

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

  const fetchComments = async (pageNum: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/products/${productId}/comment`, {
        params: { page: pageNum, limit: 5 },
      });
      const newComments = response.data.comments;
      setComments((prev) =>
        pageNum === 1 ? newComments : [...prev, ...newComments]
      );
      setHasMore(newComments.length === 5);
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
        <Card key={comment._id} className="mb-6 border-primary/10 shadow-sm">
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
                    {comment.rating && (
                      <Rating value={comment.rating} readOnly />
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(comment.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="mt-2 text-sm text-popover-foreground">
                  {comment.content}
                </p>
                <p className="text-xs text-muted-foreground mt-2 flex items-center">
                  <Mail className="mr-1 h-3 w-3" /> {comment.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
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

function CommentsSkeleton() {
  return (
    <>
      {[1, 2, 3].map((n) => (
        <Card key={n} className="mb-6 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
                <Skeleton className="h-3 w-[120px]" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-3 w-[160px]" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
