import { NextRequest, NextResponse } from "next/server";
import { checkAdminAuthorization } from "../adminAuth";
import dbConnect from "@/lib/dbConnect";
import { createNextResponse } from "@/lib/ApiResponse";
import CommentModel from "@/model/Comment";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const authResponse = await checkAdminAuthorization();
    if (authResponse) return authResponse;

    const { searchParams } = req.nextUrl;
    let page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const query: any = {};
    if (search) {
      page = 1;
      query.$or = [
        { content: { $regex: search, $options: "i" } },
        { "user.username": { $regex: search, $options: "i" } },
        { "product.name": { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const comments = await CommentModel.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          content: 1,
          rating: 1,
          createdAt: 1,
          "user._id": 1,
          "user.username": 1,
          "product._id": 1,
          "product.name": 1,
        },
      },
    ]);

    const totalComments = await CommentModel.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        message: "Comments retrieved successfully",
        comments,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalComments / limit),
          totalComments,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving comments:", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return createNextResponse(false, message, 500);
  }
}
