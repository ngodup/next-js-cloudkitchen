import { NextResponse } from "next/server";

// Base API response interface
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Helper function to create API responses
function createApiResponse<T>(
  success: boolean,
  message: string,
  data?: T
): ApiResponse<T> {
  return { success, message, data };
}

// Helper function to create NextResponse
export function createNextResponse<T>(
  success: boolean,
  message: string,
  status: number,
  data?: T
): NextResponse {
  const response = createApiResponse(success, message, data);
  return NextResponse.json(response, { status });
}
