import { getServerSession } from "next-auth/next";
import { createNextResponse } from "@/lib/ApiResponse";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

type AuthUser = {
  _id: string;
  email: string | null | undefined;
};

type AuthSuccess = {
  user: AuthUser;
};

type AuthError = ReturnType<typeof createNextResponse>;

export async function checkUserAuthentication(): Promise<
  AuthSuccess | AuthError
> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?._id) {
    return createNextResponse(false, "Authentication required", 401);
  }

  return {
    user: {
      _id: session.user._id,
      email: session.user.email,
    },
  };
}
