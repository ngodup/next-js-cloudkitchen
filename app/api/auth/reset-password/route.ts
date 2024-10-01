import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  await dbConnect();

  const { token, newPassword } = await req.json();

  try {
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() },
    });
    console.log("user in reset password", user);

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password and clear the reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    return NextResponse.json(
      { message: "Password has been reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { message: "Error resetting password" },
      { status: 500 }
    );
  }
}
