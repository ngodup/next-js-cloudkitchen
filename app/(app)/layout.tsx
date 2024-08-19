import Header from "@/components/layout/header";
import SideMenu from "@/components/layout/sidebar/side-menu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex overflow-x-hidden">
      <SideMenu />
      <main className="w-full flex-1 overflow-hidden">
        {/* header for page client */}
        <Header />
        {children}
      </main>
    </div>
  );
}
