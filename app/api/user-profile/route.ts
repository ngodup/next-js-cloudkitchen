import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbConnect";
import { createNextResponse } from "@/lib/ApiResponse";
import { authOptions } from "../auth/[...nextauth]/options";
import UserProfileModel from "@/model/UserProfile";
import { userProfileSchema } from "@/schemas/userProfileShcema";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?._id && !session?.user?.email) {
      return createNextResponse(false, "Not authenticated", 401);
    }

    let userProfile;
    if (session.user._id) {
      userProfile = await UserProfileModel.findOne({
        userId: session.user._id,
      }).lean();
    }

    if (!userProfile && session.user.email) {
      userProfile = await UserProfileModel.findOne({
        email: session.user.email,
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
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    return createNextResponse(false, "Internal server error", 500);
  }
}
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?._id || !session?.user?.email) {
      return createNextResponse(false, "Not authenticated", 401);
    }

    const body = await req.json();
    console.log("Parsed userprofile: ", body);
    const validationResult = userProfileSchema.safeParse(body);

    if (!validationResult.success) {
      return createNextResponse(
        false,
        `Invalid user profile data ${validationResult.error.issues}`,
        400
      );
    }

    const existingProfile = await UserProfileModel.findOne({
      userId: session.user._id,
    });
    if (existingProfile) {
      return createNextResponse(
        false,
        "User profile already exists. Use PUT to update.",
        409
      );
    }

    const newUserProfile = new UserProfileModel({
      userId: session.user._id,
      email: session.user.email,
      ...validationResult.data,
    });

    console.log("New user profile to be saved:", newUserProfile);
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
  } catch (error) {
    console.error("Error creating user profile:", error);
    return createNextResponse(false, "Internal server error", 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return createNextResponse(false, "Not authenticated", 401);
    }

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
      { userId: session.user._id },
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
  } catch (error) {
    console.error("Error updating user profile:", error);
    return createNextResponse(false, "Internal server error", 500);
  }
}
