"use client";

import { Poppins } from "next/font/google";
import Header from "@/components/layout/header";
import SideMenu from "@/components/layout/sidebar/side-menu";
import { cn } from "@/lib/utils";

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
    <div className={cn("flex", poppins.className)}>
      <div className="hidden lg:block">
        <SideMenu />
      </div>

      <main className="w-full flex-1 overflow-hidden">
        {/* header for page client */}
        <Header />
        {children}
      </main>
    </div>
  );
}
