import { NextRequest, NextResponse } from "next/server";
import { createNextResponse } from "@/lib/ApiResponse";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/model/Product";
import UserModel from "@/model/User";
import CommentModel from "@/model/Comment";
import { IComment } from "@/types";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

interface TransformedComment extends IComment {
  userName?: string;
  email?: string;
}

function transformComment(comment: any): TransformedComment {
  const transformedComment: TransformedComment = {
    _id: comment._id.toString(),
    content: comment.content,
    createdAt: comment.createdAt,
    productId: comment.productId.toString(),
    userId: comment.userId._id
      ? comment.userId._id.toString()
      : comment.userId.toString(),
  };

  if (comment.rating !== undefined) {
    transformedComment.rating = comment.rating;
  }

  if (comment.userId.username) {
    transformedComment.userName = comment.userId.username;
  }

  if (comment.userId.email) {
    transformedComment.email = comment.userId.email;
  }

  return transformedComment;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = params;

    if (!id) {
      return createNextResponse(false, "Missing product id", 400);
    }

    const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const comments = await CommentModel.find({ productId: id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "username email")
      .lean();

    const totalComments = await CommentModel.countDocuments({ productId: id });

    const transformedComments = comments.map(transformComment);

    return NextResponse.json(
      {
        success: true,
        message: "Comments retrieved successfully",
        comments: transformedComments,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalComments / limit),
          totalComments,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting comments for the product:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return createNextResponse(
      false,
      `Error retrieving comments: ${errorMessage}`,
      500
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Step 1: Check if user is logged in
    const session = await getServerSession({
      req: { headers: request.headers },
      ...authOptions,
    });

    if (!session) {
      return NextResponse.json(
        createNextResponse(false, "Not authenticated", 401)
      );
    }

    const { content, rating, userId, productId } = await request.json();

    if (!content || !userId || !productId) {
      return NextResponse.json(
        createNextResponse(false, "Missing required fields", 400)
      );
    }

    // Check if rating is provided and valid
    if (
      rating !== undefined &&
      (typeof rating !== "number" || rating < 0 || rating > 5)
    ) {
      return createNextResponse(
        false,
        "Invalid rating. Must be a number between 0 and 5",
        400
      );
    }

    const [user, product] = await Promise.all([
      UserModel.findById(userId),
      ProductModel.findById(productId),
    ]);

    if (!user) {
      return createNextResponse(false, "User not found", 404);
    }

    if (!product) {
      return NextResponse.json(
        createNextResponse(false, "Product not found", 404)
      );
    }

    const commentData: Partial<IComment> = {
      createdAt: new Date(),
      content,
      productId,
      userId,
    };

    // Only add rating if it's provided and not zero
    if (rating !== undefined && rating !== 0) {
      commentData.rating = rating;
    }

    const newComment = await CommentModel.create(commentData);
    const transformedComment = transformComment(newComment);

    // Update product rating only if a valid rating was provided
    if (rating !== undefined && rating !== 0) {
      await updateProductRating(productId);
    }
    const message =
      rating !== undefined && rating !== 0
        ? "Comment and rating added successfully"
        : "Comment added successfully";

    return NextResponse.json(
      {
        success: true,
        message,
        comment: transformedComment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding comment:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return createNextResponse(
      false,
      `Error adding comment: ${errorMessage}`,
      500
    );
  }
}

async function updateProductRating(productId: string) {
  const allProductComments = await CommentModel.find({
    productId,
    rating: { $exists: true, $ne: 0 },
  });

  const totalRating = allProductComments.reduce((sum: number, comment: any) => {
    return sum + (comment.rating || 0);
  }, 0);

  const averageRating =
    allProductComments.length > 0 ? totalRating / allProductComments.length : 0;

  await ProductModel.findByIdAndUpdate(productId, {
    rating: averageRating,
  });
}
