import AdminSessionProvider from "../providers/admin/AdminSessionProvider";
import AdminClientLayout from "./AdminClientLayout";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminSessionProvider>
      <AdminClientLayout>{children}</AdminClientLayout>
    </AdminSessionProvider>
  );
}
