import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
import { fetchAdminAnalytics } from "@/lib/admin/adminAnalyticsApi";

export default async function AdminPage() {
  let initialData = null;

  try {
    initialData = await fetchAdminAnalytics();
  } catch (error) {
    console.error("Error fetching initial admin data:", error);
  }

  return <AdminDashboardClient initialData={initialData} />;
}
