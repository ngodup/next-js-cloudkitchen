import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { ApiResponse } from "@/types/ApiResponse";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

function createApiResponse(
  success: boolean,
  message: string,
  status: number
): NextResponse<ApiResponse> {
  return NextResponse.json<ApiResponse>({ success, message }, { status });
}

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    const result = UsernameQuerySchema.safeParse(queryParam);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return createApiResponse(
        false,
        usernameErrors.length > 0
          ? usernameErrors.join(", ")
          : "Invalid query parameters",
        400
      );
    }

    const { username } = result.data;

    // Convert username to lowercase for case-insensitive comparison
    const lowercaseUsername = username.toLowerCase();

    const existingVerifiedUser = await UserModel.findOne({
      username: { $regex: new RegExp(`^${lowercaseUsername}$`, "i") },
      // isVerified: true,
    });

    if (existingVerifiedUser) {
      return createApiResponse(
        false,
        "Username is already taken, Please select another username",
        409
      );
    }

    return createApiResponse(true, "Username is available", 200);
  } catch (error) {
    console.error("Error checking username:", error);
    return createApiResponse(false, "Error checking username", 500);
  }
}
