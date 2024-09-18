"use client";

import React from "react";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import AdminSidebar from "@/app/admin/components/layout/AdminSidebar";
import ErrorBoundary from "@/components/ErrorBoundary";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function AdminClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <div className={cn("flex", poppins.className)}>
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>
        <div className="flex-1 overflow-hidden">
          <main className="p-4">{children}</main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
