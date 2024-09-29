import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { createNextResponse } from "@/lib/ApiResponse";
import CommentModel from "@/model/Comment";
import { Types } from "mongoose";
import { checkUserAuthentication } from "@/app/api/userAuthCheck";

export async function GET(
  req: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
    await dbConnect();

    const authResult = await checkUserAuthentication();
    if ("user" in authResult) {
      const userId = authResult.user._id;
      const { commentId } = params;

      if (!Types.ObjectId.isValid(commentId)) {
        return createNextResponse(false, "Invalid comment ID", 400);
      }

      const comment = await CommentModel.findOne({
        _id: commentId,
        userId,
      }).populate("productId", "name");

      if (!comment) {
        return createNextResponse(
          false,
          "Comment not found or unauthorized",
          404
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Comment retrieved successfully",
          comment,
        },
        { status: 200 }
      );
    } else {
      return authResult;
    }
  } catch (error) {
    console.error("Error retrieving comment:", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return createNextResponse(false, message, 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
    await dbConnect();

    const authResult = await checkUserAuthentication();
    if ("user" in authResult) {
      const userId = authResult.user._id;
      const { commentId } = params;
      const { content, rating } = await req.json();

      if (!Types.ObjectId.isValid(commentId)) {
        return createNextResponse(false, "Invalid comment ID", 400);
      }

      // Create an update object
      const updateObj: { content: string; rating?: number | null } = {
        content,
      };

      // Only include rating in the update if it's not undefined
      if (rating !== undefined) {
        updateObj.rating = rating;
      }

      const updatedComment = await CommentModel.findOneAndUpdate(
        { _id: commentId, userId },
        updateObj,
        { new: true }
      ).populate("productId", "name");

      if (!updatedComment) {
        return createNextResponse(
          false,
          "Comment not found or unauthorized",
          404
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Comment updated successfully",
          comment: updatedComment,
        },
        { status: 200 }
      );
    } else {
      return authResult;
    }
  } catch (error) {
    console.error("Error updating comment:", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return createNextResponse(false, message, 500);
  }
}
export async function DELETE(
  req: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
    await dbConnect();

    const authResult = await checkUserAuthentication();
    if ("user" in authResult) {
      const userId = authResult.user._id;
      const { commentId } = params;

      if (!Types.ObjectId.isValid(commentId)) {
        return createNextResponse(false, "Invalid comment ID", 400);
      }

      const deletedComment = await CommentModel.findOneAndDelete({
        _id: commentId,
        userId,
      });

      if (!deletedComment) {
        return createNextResponse(
          false,
          "Comment not found or unauthorized",
          404
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Comment deleted successfully",
        },
        { status: 200 }
      );
    } else {
      return authResult;
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return createNextResponse(false, message, 500);
  }
}
