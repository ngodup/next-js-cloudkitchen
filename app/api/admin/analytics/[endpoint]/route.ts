// app/api/admin/analytics/[endpoint]/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { createNextResponse } from "@/lib/ApiResponse";
import UserModel from "@/model/User";
import ProductModel from "@/model/Product";
import OrderModel from "@/model/Order";
import { checkAdminAuthorization } from "../../adminAuth";

export async function GET(
  req: NextRequest,
  { params }: { params: { endpoint: string } }
) {
  await dbConnect();

  const authResponse = await checkAdminAuthorization();
  if (authResponse) return authResponse;

  try {
    switch (params.endpoint) {
      case "total-users":
        return await getTotalUsers();
      case "total-products":
        return await getTotalProducts();
      case "daily-sell":
        return await getDailySell();
      case "monthly-sell":
        return await getMonthlySell();
      default:
        return NextResponse.json(
          { error: "Endpoint not found" },
          { status: 404 }
        );
    }
  } catch (error) {
    console.error(error);
    return createNextResponse(false, `An error occurred: ${error}`, 500);
  }
}

async function getTotalUsers() {
  const totalUsers = await UserModel.countDocuments();
  return NextResponse.json({
    success: true,
    totalUsers,
    message: "Total users retrieved successfully",
  });
}

async function getTotalProducts() {
  const totalProducts = await ProductModel.countDocuments();
  return NextResponse.json({
    success: true,
    totalProducts,
    message: "Total products retrieved successfully",
  });
}
async function getDailySell() {
  const twentyFourHoursAgo = new Date();
  twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
  twentyFourHoursAgo.setMinutes(0, 0, 0); // Set to start of the hour

  const dailySell = await OrderModel.aggregate([
    {
      $match: {
        createdAt: { $gte: twentyFourHoursAgo },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$totalPrice" },
      },
    },
  ]);

  const totalSales = dailySell[0] ? dailySell[0].totalSales : 0;

  return NextResponse.json({
    success: true,
    totalSales,
    message: "Daily sales retrieved successfully",
  });
}

async function getMonthlySell() {
  const currentMonth = new Date();
  currentMonth.setDate(1); // Set to first day of the month
  currentMonth.setHours(0, 0, 0, 0); // Set to start of the day

  const nextMonth = new Date(currentMonth);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const monthlySell = await OrderModel.aggregate([
    {
      $match: {
        createdAt: { $gte: currentMonth, $lt: nextMonth },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$totalPrice" },
      },
    },
  ]);

  const totalSales = monthlySell[0] ? monthlySell[0].totalSales : 0;

  return NextResponse.json({
    success: true,
    totalSales,
    message: "Monthly sales retrieved successfully",
  });
}
