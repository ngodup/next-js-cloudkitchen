import { NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificaitonEmail";
import { createNextResponse } from "@/types/ApiResponse";

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

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { email, password, username } = await request.json();

    const existingUser = await findUserByEmail(email);
    const verifyCode = generateVerifyCode();

    if (existingUser) {
      if (existingUser.isVerified) {
        return createNextResponse(
          false,
          "User already exists with this email",
          400
        );
      }
      //else { //Vefification update
      //   // Update existing unverified user
      //   existingUser.password = await hashPassword(password);
      //   existingUser.verifyCode = verifyCode;
      //   existingUser.verifyCodeExpiry = getVerifyCodeExpiry();
      //   await existingUser.save();
      // }
    } else {
      // Create new user
      const newUser = new UserModel({
        username: username.toLowerCase(),
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
      return createNextResponse(
        false,
        "Failed to send verification email",
        500
      );
    }

    return createNextResponse(
      true,
      "User registered successfully. Verification email sent.",
      201
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return createNextResponse(false, "Internal server error", 500);
  }
}
