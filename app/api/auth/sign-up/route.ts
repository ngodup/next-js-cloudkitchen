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

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { email, password } = await request.json();
    //Step 1 Check existing user verfied token
    const existingVerifiedUser = await UserModel.findOne({
      email,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "User is already taken" },
        { status: 400 }
      );
    }

    // Step 2: Check if the user exists
    const existingUserByEmail = await findUserByEmail(email);
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return NextResponse.json<ApiResponse>(
          { success: false, message: "User already exists with this email" },
          { status: 400 }
        );
      } else {
        // Step 3: Existing user without email verified, possibly forgot password
        existingUserByEmail.password = await hashPassword(password);
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour expiry
        await existingUserByEmail.save();
      }
    } else {
      //Step 4: New user
      const newUser = new UserModel({
        email,
        password: await hashPassword(password),
        verifyCode,
        verifyCodeExpiry: new Date(Date.now() + 3600000), // 1 hour expiry
        isVerified: false,
        isAdmin: false,
      });
      await newUser.save();
    }

    //Step 5: Saved new user then Send verification email
    const emailResponse = await sendVerificationEmail(email, verifyCode);
    if (!emailResponse.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Failed to send verification email" },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "User registered successfully. Verification email sent.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
