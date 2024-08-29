import { NextRequest, NextResponse } from "next/server";
import { createApiResponse } from "@/types/ApiResponse";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/model/Product";
import UserModel from "@/model/User";
import CommentModel from "@/model/Comment";
import { IComment } from "@/types";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

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
  try {
    await dbConnect();

    // Use the cookies from the request object to get the session
    const session = await getServerSession({
      req: { headers: request.headers },
      ...authOptions,
    });

    if (!session) {
      return NextResponse.json(
        createApiResponse<undefined>(false, "Not authenticated", 401)
      );
    }

    const { content, userId, productId } = await request.json();

    if (!content || !userId || !productId) {
      return NextResponse.json(
        createApiResponse<undefined>(false, "Missing required fields", 400)
      );
    }

    const [user, product] = await Promise.all([
      UserModel.findById(userId),
      ProductModel.findById(productId),
    ]);

    if (!user) {
      return NextResponse.json(
        createApiResponse<undefined>(false, "User not found", 404)
      );
    }

    if (!product) {
      return NextResponse.json(
        createApiResponse<undefined>(false, "Product not found", 404)
      );
    }

    const newComment = await CommentModel.create({
      content,
      productId,
      userId,
    });

    const transformedComment = transformComment(newComment);

    return NextResponse.json(
      createApiResponse<IComment>(
        true,
        "Comment added successfully",
        201,
        transformedComment
      )
    );
  } catch (error) {
    console.error("Error adding comment:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      createApiResponse<undefined>(
        false,
        `Error adding comment: ${errorMessage}`,
        500
      )
    );
  }
}
