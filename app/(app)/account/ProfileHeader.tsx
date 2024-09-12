import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { IUserProfile } from "@/types";
import { useSession } from "next-auth/react";
import React from "react";

interface ProfileHeaderProps {
  userProfile: IUserProfile;
}

export function ProfileHeader({ userProfile }: ProfileHeaderProps) {
  const { data: session } = useSession();

  return (
    <div className="flex items-center space-x-4 mb-6">
      <Avatar className="h-24 w-24">
        <AvatarImage
          src={userProfile.avatarUrl || ""}
          alt={userProfile.firstName || session?.user.username || "User"}
        />
        <AvatarFallback>
          {(
            userProfile.firstName?.[0] ||
            session?.user.username?.[0] ||
            "U"
          ).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-xl font-semibold">
          {userProfile.firstName
            ? `${userProfile.firstName} ${userProfile.lastName || ""}`
            : session?.user.username}
        </h2>
        <p className="text-gray-500">{session?.user.email}</p>
      </div>
    </div>
  );
}
