import { NextRequest } from "next/server";
import { createApiResponse, ApiCommentResponse } from "@/types/ApiResponse";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/model/Product";
import UserModel from "@/model/User";
import CommentModel from "@/model/Comment";
import { IComment } from "@/types";

// Helper function to transform MongoDB document to IComment
function transformComment(comment: any): IComment {
  return {
    _id: comment._id.toString(),
    content: comment.content,
    createdAt: comment.createdAt,
    productId: comment.productId.toString(),
    userId: comment.userId.toString(),
  };
}

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { content, userId, productId } = await request.json();

    if (!content || !userId || !productId) {
      return createApiResponse<undefined>(
        false,
        "Missing required fields",
        400
      );
    }

    const [user, product] = await Promise.all([
      UserModel.findById(userId),
      ProductModel.findById(productId),
    ]);

    if (!user) {
      return createApiResponse<undefined>(false, "User not found", 404);
    }

    if (!product) {
      return createApiResponse<undefined>(false, "Product not found", 404);
    }

    const newComment = await CommentModel.create({
      content,
      productId,
      userId,
    });

    const transformedComment = transformComment(newComment);

    return createApiResponse<IComment>(
      true,
      "Comment added successfully",
      201,
      transformedComment
    );
  } catch (error) {
    console.error("Error adding comment:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return createApiResponse<undefined>(
      false,
      `Error adding comment: ${errorMessage}`,
      500
    );
  }
}
