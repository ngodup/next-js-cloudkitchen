import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { createNextResponse } from "@/lib/ApiResponse";
import CommentModel from "@/model/Comment";
import { Types } from "mongoose";
import { checkUserAuthentication } from "../../userAuthCheck";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const authResult = await checkUserAuthentication();
    if ("user" in authResult) {
      const userId = authResult.user._id;
      const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
      const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10");

      const skip = (page - 1) * limit;

      const userComments = await CommentModel.aggregate([
        { $match: { userId: new Types.ObjectId(userId) } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "product",
          },
        },
        { $unwind: "$product" },
        {
          $project: {
            _id: 1,
            content: 1,
            rating: 1,
            createdAt: 1,
            productId: 1,
            "product.name": 1,
          },
        },
        { $sort: { createdAt: -1 } },
      ]);

      const totalComments = await CommentModel.countDocuments({ userId });

      return NextResponse.json(
        {
          success: true,
          message: "User comments retrieved successfully",
          comments: userComments,
          totalComments,
          currentPage: page,
          totalPages: Math.ceil(totalComments / limit),
        },
        { status: 200 }
      );
    } else {
      return authResult;
    }
  } catch (error) {
    console.error("Error retrieving user comments:", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return createNextResponse(false, message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const authResult = await checkUserAuthentication();
    if ("user" in authResult) {
      const userId = authResult.user._id;
      const { content, rating, productId } = await req.json();

      if (!content || !productId) {
        return createNextResponse(false, "Missing required fields", 400);
      }

      const newComment = new CommentModel({
        content,
        rating,
        productId,
        userId,
      });

      await newComment.save();

      return NextResponse.json(
        {
          success: true,
          message: "Comment created successfully",
          comment: newComment,
        },
        { status: 201 }
      );
    } else {
      return authResult;
    }
  } catch (error) {
    console.error("Error creating comment:", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return createNextResponse(false, message, 500);
  }
}
