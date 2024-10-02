import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { createNextResponse } from "@/lib/ApiResponse";

export const dynamic = "force-dynamic";

const UsernameSchema = z.object({
  username: usernameValidation,
});

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const body = await request.json();
    const result = UsernameSchema.safeParse(body);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return createNextResponse(
        false,
        usernameErrors.length > 0
          ? usernameErrors.join(", ")
          : "Invalid username",
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
      return createNextResponse(
        false,
        "Username is already taken. Please select another username",
        409
      );
    }

    return createNextResponse(true, "Username is available", 200);
  } catch (error) {
    console.error("Error checking username:", error);
    return createNextResponse(false, "Error checking username", 500);
  }
}
