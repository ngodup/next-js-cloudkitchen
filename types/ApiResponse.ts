import { FoodItem } from ".";

export interface ApiResponse {
  success: boolean;
  message: string;
}

// Interface for a product-specific API response, extending the base response
export interface ApiProductResponse extends ApiResponse {
  products: FoodItem[];
}
