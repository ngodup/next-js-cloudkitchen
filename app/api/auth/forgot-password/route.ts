import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Resend } from "resend";
import { v4 as uuidv4 } from "uuid";
import PasswordResetEmail from "@/emails/PasswordResetEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  await dbConnect();

  const { email } = await req.json();

  try {
    const user = await UserModel.findOne({ email });
    console.log("User found:", user);

    if (!user) {
      console.log("No user found with email:", email);
      return NextResponse.json(
        {
          message:
            "If an account exists for that email, we have sent password reset instructions.",
        },
        { status: 200 }
      );
    }

    const resetPasswordToken = uuidv4();
    const resetPasswordExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpiry = resetPasswordExpiry;

    console.log("User before save:", user);

    try {
      const savedUser = await user.save();
      console.log("User after save:", savedUser);
    } catch (saveError) {
      console.error("Error saving user:", saveError);
      throw new Error("Failed to save reset password information");
    }

    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetPasswordToken}`;

    try {
      const emailResponse = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: user.email,
        subject: "Password Reset Request",
        react: PasswordResetEmail({ resetUrl }),
      });

      if (emailResponse.data) {
        console.log(
          "Password reset email sent successfully:",
          emailResponse.data
        );
      } else {
        console.error(
          "Failed to send password reset email:",
          emailResponse.error
        );
        throw new Error("Failed to send password reset email");
      }
    } catch (emailError) {
      console.error("Error sending password reset email:", emailError);
      throw new Error("Error sending password reset email");
    }

    return NextResponse.json(
      {
        message:
          "If an account exists for that email, we have sent password reset instructions.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { message: "Error processing password reset request" },
      { status: 500 }
    );
  }
}
