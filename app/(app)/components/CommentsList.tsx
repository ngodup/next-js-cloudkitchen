import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Mail,
  Star,
} from "lucide-react";
import { IComment } from "@/types";
import Rating from "./rating";

interface IExtendComment extends IComment {
  userName: string;
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/products/${productId}/comment`,
        {
          params: { page },
        }
      );
      setComments(response.data.comments);
      setCurrentPage(response.data.pagination.currentPage);
      setTotalPages(response.data.pagination.totalPages);
    } catch (err) {
      setError("Failed to fetch comments. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments(1);
  }, [productId, refreshTrigger]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchComments(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      fetchComments(currentPage - 1);
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

      {isLoading ? (
        <CommentsSkeleton />
      ) : comments.length > 0 ? (
        <>
          {comments.map((comment) => (
            <Card
              key={comment._id}
              className="mb-6 border-primary/10 shadow-sm"
            >
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  {/* <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={`https://api.dicebear.com/6.x/initials/svg?seed=${comment.userName}`}
                    />
                    <AvatarFallback className="bg-primary">
                      {comment.userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar> */}
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(comment.userName, comment.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-popover-foreground">
                        {comment.userName || comment.email.split("@")[0]}
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

          {totalPages > 1 && (
            <CardFooter className="flex justify-between items-center mt-4">
              <Button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
                className="text-primary hover:text-primary-foreground hover:bg-primary"
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
                className="text-primary hover:text-primary-foreground hover:bg-primary"
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          )}
        </>
      ) : (
        <Card className="mb-6 border-primary/10 shadow-sm">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No comments yet. Be the first to review this product!
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
