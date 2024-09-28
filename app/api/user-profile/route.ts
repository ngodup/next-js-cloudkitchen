import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbConnect";
import { createNextResponse } from "@/lib/ApiResponse";
import { authOptions } from "../auth/[...nextauth]/options";
import UserProfileModel from "@/model/UserProfile";
import { userProfileSchema } from "@/schemas/userProfileShcema";
import { checkUserAuthentication } from "../userAuthCheck";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const authResult = await checkUserAuthentication();
    if ("user" in authResult) {
      const user = authResult.user;

      let userProfile;
      if (user._id) {
        userProfile = await UserProfileModel.findOne({
          userId: user._id,
        }).lean();
      }

      if (!userProfile && user.email) {
        userProfile = await UserProfileModel.findOne({
          email: user.email,
        }).lean();
      }

      if (!userProfile) {
        return createNextResponse(
          true,
          "User profile not found, but can be created",
          404
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "User profile retrieved successfully",
          userProfile,
        },
        { status: 200 }
      );
    } else {
      return authResult;
    }
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    return createNextResponse(false, "Internal server error", 500);
  }
}
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const authResult = await checkUserAuthentication();
    if ("user" in authResult) {
      const user = authResult.user;
      const body = await req.json();
      const validationResult = userProfileSchema.safeParse(body);

      if (!validationResult.success) {
        return createNextResponse(
          false,
          `Invalid user profile data ${validationResult.error.issues}`,
          400
        );
      }

      const existingProfile = await UserProfileModel.findOne({
        userId: user._id,
      });
      if (existingProfile) {
        return createNextResponse(
          false,
          "User profile already exists. Use PUT to update.",
          409
        );
      }

      const newUserProfile = new UserProfileModel({
        userId: user._id,
        email: user.email,
        ...validationResult.data,
      });

      await newUserProfile.save();

      return NextResponse.json(
        {
          success: true,
          message: "User profile created successfully",
          userProfile: newUserProfile,
        },
        {
          status: 201,
        }
      );
    } else {
      return authResult;
    }
  } catch (error) {
    console.error("Error creating user profile:", error);
    return createNextResponse(false, "Internal server error", 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    const authResult = await checkUserAuthentication();
    if ("user" in authResult) {
      const user = authResult.user;
      const body = await req.json();
      const validationResult = userProfileSchema.partial().safeParse(body);

      if (!validationResult.success) {
        return createNextResponse(
          false,
          `Invalid user profile data ${validationResult.error.issues}`,
          400
        );
      }

      const updatedProfile = await UserProfileModel.findOneAndUpdate(
        { userId: user._id },
        {
          $set: {
            ...validationResult.data,
            lastUpdated: new Date(),
          },
        },
        { new: true, runValidators: true, upsert: true }
      );

      return NextResponse.json(
        {
          success: true,
          message: "User profile updated successfully",
          userProfile: updatedProfile,
        },
        {
          status: 200,
        }
      );
    } else {
      return authResult;
    }
  } catch (error) {
    console.error("Error updating user profile:", error);
    return createNextResponse(false, "Internal server error", 500);
  }
}
