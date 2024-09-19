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
        .catch(setError)
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
      setError(err instanceof Error ? err : new Error("An error occurred"));
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, refetch };
}
