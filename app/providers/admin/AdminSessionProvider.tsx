"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (status !== "loading") {
      if (!session) {
        router.push("/auth/sign-in");
      } else if (session.user.role !== "admin") {
        router.push("/");
      } else {
        setIsChecking(false);
      }
    }
  }, [session, status, router]);

  if (status === "loading" || isChecking) {
    return <AdminLoadingSkeleton />;
  }

  if (!session || session.user.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}

function AdminLoadingSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <Skeleton className="h-10 w-1/4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
