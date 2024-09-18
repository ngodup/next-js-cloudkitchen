"use client";

import React from "react";
import { useAdminAnalytics } from "@/hooks/admin/useAdminAnalytics";
import AdminDashboard from "./AdminDashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AnalyticsData } from "@/lib/admin/adminAnalyticsApi";

export default function AdminDashboardClient({
  initialData,
}: {
  initialData: AnalyticsData | null;
}) {
  const { data, isLoading, error, refetch } = useAdminAnalytics(initialData);

  if (isLoading && !initialData) {
    return <AdminDashboardSkeleton />;
  }

  if (error) {
    return (
      <Card className="p-6 text-red-500">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p>Failed to load analytics data:</p>
        <p>{error.message}</p>
        <button
          onClick={refetch}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </Card>
    );
  }

  return (
    <AdminDashboard analyticsData={data || initialData} refetchData={refetch} />
  );
}

function AdminDashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <Skeleton className="h-10 w-1/4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Add more skeleton components as needed */}
    </div>
  );
}
