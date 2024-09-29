import React from "react";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const CommentsSkeleton = () => {
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
};

export default CommentsSkeleton;
