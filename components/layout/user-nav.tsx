"use client";

import Link from "next/link";
import React from "react";
import { User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
interface UserNavProps {
  className?: string;
}

export default function UserNav({ className }: UserNavProps) {
  const { data: session, update } = useSession();

  const onSignOut = async () => {
    await signOut();
  };

  return (
    <div className={className}>
      {!session ? (
        <Link href="/auth/sign-in" className="text-xs hover:text-primary">
          <div className="flex justify-star items-center rounded border border-gray p-2 gap-0">
            <p className="block w-12">Sign in</p>
            <div>
              <User strokeWidth={1.5} />
            </div>
          </div>
        </Link>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {(session.user?.username?.[0] || "U").toUpperCase()}
                </AvatarFallback>
                {/* <AvatarFallback>CN</AvatarFallback> */}
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="font-medium text-sm leading-none">
                  {session.user.username}
                </p>
                <p className="text-xs text-muted-foreground leading-none">
                  {session.user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>New Team</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onSignOut}>
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
