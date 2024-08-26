import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificaitonEmail";
import { ApiResponse } from "@/types/ApiResponse";

async function findUserByEmail(email: string) {
  return await UserModel.findOne({ email });
}

async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

function generateVerifyCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getVerifyCodeExpiry(): Date {
  return new Date(Date.now() + 3600000); // 1 hour expiry
}

function createApiResponse(
  success: boolean,
  message: string,
  status: number
): NextResponse<ApiResponse> {
  return NextResponse.json<ApiResponse>({ success, message }, { status });
}

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { email, password, username } = await request.json();

    const existingUser = await findUserByEmail(email);
    const verifyCode = generateVerifyCode();

    if (existingUser) {
      if (existingUser.isVerified) {
        return createApiResponse(
          false,
          "User already exists with this email",
          400
        );
      }
      //else {
      //   // Update existing unverified user
      //   existingUser.password = await hashPassword(password);
      //   existingUser.verifyCode = verifyCode;
      //   existingUser.verifyCodeExpiry = getVerifyCodeExpiry();
      //   await existingUser.save();
      // }
    } else {
      // Create new user
      const newUser = new UserModel({
        username,
        email,
        password: await hashPassword(password),
        verifyCode,
        verifyCodeExpiry: getVerifyCodeExpiry(),
        isVerified: false,
        isAdmin: false,
      });
      await newUser.save();
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(email, verifyCode);
    if (!emailResponse.success) {
      return createApiResponse(false, "Failed to send verification email", 500);
    }

    return createApiResponse(
      true,
      "User registered successfully. Verification email sent.",
      201
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return createApiResponse(false, "Internal server error", 500);
  }
}
