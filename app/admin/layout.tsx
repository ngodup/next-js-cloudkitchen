import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import AdminSessionProvider from "./components/AdminSessionProvider";
import AdminSidebar from "./components/AdminSidebar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminSessionProvider>
      <div className={cn("flex", poppins.className)}>
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>
        <div className="flex-1 overflow-hidden">
          <main className="p-4">{children}</main>
        </div>
      </div>
    </AdminSessionProvider>
  );
}
