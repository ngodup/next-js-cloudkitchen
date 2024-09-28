import { getServerSession } from "next-auth/next";
import { createNextResponse } from "@/lib/ApiResponse";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function checkAdminAuthorization() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?._id || session.user.role !== "admin") {
    return createNextResponse(false, "Not Authorized", 403);
  }
  return null;
}
