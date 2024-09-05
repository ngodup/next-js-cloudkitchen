import { NextResponse } from "next/server";
import { IFoodItem, IComment, IOrder } from ".";

// Base API response interface

export interface ApiResponse<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
}

// Type aliases for specific response types
export type ApiProductResponse = ApiResponse<IFoodItem>;
export type ApiProductsResponse = ApiResponse<IFoodItem[]>;
export type ApiCommentResponse = ApiResponse<IComment>;
export type ApiCommentsResponse = ApiResponse<IComment[]>;
export type ApiOrderResponse = ApiResponse<IOrder>;
export type ApiOrdersResponse = ApiResponse<IOrder[]>;

// Helper function to create API responses
export function createApiResponse<T>(
  success: boolean,
  message: string,
  status: number,
  data?: T
): NextResponse<ApiResponse<T>> {
  return NextResponse.json<ApiResponse<T>>(
    { success, message, data },
    { status }
  );
}
