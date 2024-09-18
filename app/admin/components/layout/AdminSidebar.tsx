"use client";

import { adminNavItems } from "@/constants/data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/useSidebar";
import { useSession, signOut } from "next-auth/react";
import MenuTitle from "@/components/layout/sidebar/menu-title";
import AdminNav from "./AdminNav";

const AdminSidebar: React.FC = () => {
  const { isMinimized, toggle } = useSidebar();
  const { data: session } = useSession();

  const handleToggle = () => {
    toggle();
  };

  const onSignOut = async () => {
    await signOut();
  };

  return (
    <aside
      className={cn(
        `relative p-4 flex flex-col h-screen border-r`,
        !isMinimized ? "w-72" : "w-[72px]"
      )}
    >
      <header className="border-b pb-2 dark:border-b-black border-b-green-600 mb-4 flex items-center justify-between">
        <MenuTitle />
      </header>

      <div className="flex-grow">
        <AdminNav navItems={adminNavItems} />
      </div>

      <footer className="md:flex md:gap-2 items-center mt-4 flex-shrink-0">
        {session && (
          <>
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground dark:bg-primary">
                {(session.user?.username?.[0] || "U").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Link
              href="/"
              onClick={onSignOut}
              className={cn(isMinimized && "hidden")}
            >
              Logout
            </Link>
          </>
        )}
      </footer>

      {/* Collapsible icon */}
      <div
        className="absolute -right-3 top-4 w-6 h-6 bg-background border border-border rounded-full flex items-center justify-center cursor-pointer z-50 shadow-md"
        onClick={handleToggle}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={cn(
            "transition-transform duration-200",
            isMinimized ? "rotate-180" : ""
          )}
        >
          <path
            d="M10 12L6 8L10 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </aside>
  );
};

export default AdminSidebar;
