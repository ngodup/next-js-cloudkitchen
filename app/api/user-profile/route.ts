// app/api/user-profile/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbConnect";
import { createApiResponse } from "@/types/ApiResponse";
import { authOptions } from "../auth/[...nextauth]/options";
import UserProfileModel from "@/model/UserProfile";
import { userProfileSchema } from "@/schemas/userProfileShcema";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json(
        createApiResponse<undefined>(false, "Not authenticated", 401)
      );
    }

    const userProfile = await UserProfileModel.findOne({
      userId: session.user._id,
    }).lean();

    if (!userProfile) {
      return NextResponse.json(
        createApiResponse(
          true,
          "User profile not found, but can be created",
          404
        )
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
    return NextResponse.json(
      createApiResponse<undefined>(false, "Internal server error", 500)
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json(
        createApiResponse<undefined>(false, "Not authenticated", 401)
      );
    }

    const body = await req.json();
    console.log("Pareser userprofile : ", body);
    const validationResult = userProfileSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        createApiResponse(
          false,
          `Invalid user profile data ${validationResult.error.issues}`,
          400
        )
      );
    }

    const existingProfile = await UserProfileModel.findOne({
      userId: session.user._id,
    });
    if (existingProfile) {
      return NextResponse.json(
        createApiResponse(
          false,
          "User profile already exists. Use PUT to update.",
          409
        )
      );
    }

    const newUserProfile = new UserProfileModel({
      userId: session.user._id,
      ...validationResult.data,
    });

    console.log("New user: ", newUserProfile);
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
    return NextResponse.json(
      createApiResponse<undefined>(false, "Internal server error", 500)
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json(
        createApiResponse<undefined>(false, "Not authenticated", 401)
      );
    }

    const body = await req.json();
    const validationResult = userProfileSchema.partial().safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        createApiResponse(
          false,
          `Invalid user profile data ${validationResult.error.issues}`,
          400
        )
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
    return NextResponse.json(
      createApiResponse<undefined>(false, "Internal server error", 500)
    );
  }
}
