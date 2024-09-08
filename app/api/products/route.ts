// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/model/Product";
import { createApiResponse, ApiResponse } from "@/types/ApiResponse";
import { IFoodItem } from "@/types";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const categories = searchParams.getAll("categories[]");
    const priceRange = searchParams.get("priceRange") || "all";
    const repasType = searchParams.get("repasType") || "";

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (categories.length > 0) {
      query.category = { $in: categories };
    }

    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      query.price = { $gte: min, $lte: max };
    }

    if (repasType) {
      query.repasType = repasType;
    }

    const skip = (page - 1) * limit;

    const products = await ProductModel.find(query)
      .skip(skip)
      .limit(limit)
      .lean();
    const totalProducts = await ProductModel.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        message:
          products.length > 0
            ? "Products retrieved successfully"
            : "No products found",
        products: products,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalProducts / limit),
          totalProducts,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/products:", error);
    return createApiResponse(
      false,
      "Unable to retrieve products at this time. Please check your database connection.",
      500
    );
  }
}
