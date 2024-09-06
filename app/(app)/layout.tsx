"use client";

import { Poppins } from "next/font/google";
import Header from "@/components/layout/header";
import SideMenu from "@/components/layout/sidebar/side-menu";
import Cart from "@/components/Cart";
import { cn } from "@/lib/utils";
import ErrorBoundary from "@/components/ErrorBoundary";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <div className={cn("flex", poppins.className)}>
        <div className="hidden lg:block">
          <SideMenu />
        </div>
        <div className="flex-1 overflow-hidden">
          <Header />
          <main className="p-4">{children}</main>
        </div>
        <Cart />
      </div>
    </ErrorBoundary>
  );
}
