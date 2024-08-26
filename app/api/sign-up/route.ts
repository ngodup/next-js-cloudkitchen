import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificaitonEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function POST(request: NextResponse) {
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
        {
          success: false,
          message: "User is already taken",
        },
        { status: 400 }
      );
    }

    //Step 2: Check user existing or not
    const existingUserByEmail = await UserModel.findOne({ email });

    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: "User already exists with this email",
          },
          { status: 400 }
        );
      } else {
        //Step 3:Existing user without email verified, may be forgot password
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode; // new verified code
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      //Step 4: New user
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      //Define new user model
      const newUser = new UserModel({
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAdmin: false,
      });

      await newUser.save();
    }

    //Step 5: Saved new user then Send verification email
    const emailResponse = await sendVerificationEmail(email, verifyCode);
    if (!emailResponse.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully. Please verify your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      { status: 500 }
    );
  }
}
