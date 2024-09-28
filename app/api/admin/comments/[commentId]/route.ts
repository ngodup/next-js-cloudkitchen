import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Types } from "mongoose";
import { checkAdminAuthorization } from "../../adminAuth";
import { createNextResponse } from "@/lib/ApiResponse";
import CommentModel from "@/model/Comment";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { commentId: string } }
) {
  try {
    await dbConnect();

    const authResponse = await checkAdminAuthorization();
    if (authResponse) return authResponse;

    const { commentId } = params;
    if (!Types.ObjectId.isValid(commentId)) {
      return createNextResponse(false, "Invalid comment ID", 400);
    }

    const { content, rating } = await req.json();

    const updatedComment = await CommentModel.findByIdAndUpdate(
      commentId,
      { content, rating },
      { new: true, runValidators: true }
    );

    if (!updatedComment) {
      return createNextResponse(false, "Comment not found", 404);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Comment updated successfully",
        comment: updatedComment,
      },
      { status: 200 }
    );
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

    const authResponse = await checkAdminAuthorization();
    if (authResponse) return authResponse;

    const { commentId } = params;
    if (!Types.ObjectId.isValid(commentId)) {
      return createNextResponse(false, "Invalid comment ID", 400);
    }

    const deletedComment = await CommentModel.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return createNextResponse(false, "Comment not found", 404);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Comment deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting comment:", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return createNextResponse(false, message, 500);
  }
}
