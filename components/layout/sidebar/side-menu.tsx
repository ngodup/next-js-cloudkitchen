"use client";

import { navItems } from "@/constants/data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/hooks/useSidebar";
import MenuTitle from "./menu-title";
import DashboardNav from "./dashboard-nav.";
import { useSession, signOut } from "next-auth/react";

const SideMenu = () => {
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
        <ChevronLeft
          className={cn(
            "z-50 absolute -right-0 cursor-pointer border rounded-full text-3xl text-foreground",
            isMinimized && "rotate-180",
            "mr-[-12px] my-1"
          )}
          onClick={handleToggle}
        />
      </header>

      <div className="flex-grow">
        <DashboardNav navItems={navItems} />
      </div>

      <footer className="md:flex md:gap-2 items-center mt-4 flex-shrink-0">
        {session && (
          <>
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground dark:bg-primary">
                NT
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
    </aside>
  );
};

export default SideMenu;
