import { useState, useEffect } from "react";
import {
  fetchAdminAnalytics,
  AnalyticsData,
} from "@/services/admin/analyticService";

export function useAdminAnalytics(initialData: AnalyticsData | null) {
  const [data, setData] = useState<AnalyticsData | null>(initialData);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!initialData) {
      fetchAdminAnalytics()
        .then(setData)
        .catch((err) => {
          console.error("Error fetching admin analytics:", err);
          setError(
            err instanceof Error
              ? err
              : new Error("An error occurred while fetching admin analytics")
          );
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [initialData]);

  const refetch = async () => {
    setIsLoading(true);
    try {
      const newData = await fetchAdminAnalytics();
      setData(newData);
    } catch (err) {
      console.error("Error refetching admin analytics:", err);
      setError(
        err instanceof Error
          ? err
          : new Error("An error occurred while refetching admin analytics")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, refetch };
}
