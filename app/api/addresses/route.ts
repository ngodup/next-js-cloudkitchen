import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { createNextResponse } from "@/lib/ApiResponse";
import AddressModel from "@/model/Address";
import { checkUserAuthentication } from "../userAuthCheck";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const authResult = await checkUserAuthentication();
    if ("user" in authResult) {
      const userId = authResult.user._id;
      const addresses = await AddressModel.find({ userId });

      return NextResponse.json(
        {
          success: true,
          message: "Addresses retrieved successfully",
          addresses,
        },
        { status: 200 }
      );
    } else {
      return authResult;
    }
  } catch (error) {
    console.error("Error retrieving addresses:", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return createNextResponse(false, message, 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const authResult = await checkUserAuthentication();
    if ("user" in authResult) {
      const userId = authResult.user._id;
      const addressData = await req.json();

      // Check if this is the first address for the user
      const existingAddresses = await AddressModel.find({ userId });
      const isDefault = existingAddresses.length === 0;

      const newAddress = new AddressModel({
        userId,
        ...addressData,
        isDefault,
      });

      const savedAddress = await newAddress.save();

      return NextResponse.json(
        {
          success: true,
          address: savedAddress,
          message: "Address saved successfully",
        },
        { status: 201 }
      );
    } else {
      return authResult;
    }
  } catch (error) {
    console.error("Error saving address:", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return createNextResponse(false, message, 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    const authResult = await checkUserAuthentication();
    if ("user" in authResult) {
      const userId = authResult.user._id;
      const { addressId, ...addressData } = await req.json();

      const updatedAddress = await AddressModel.findOneAndUpdate(
        { _id: addressId, userId },
        addressData,
        { new: true }
      );

      if (!updatedAddress) {
        return createNextResponse(false, "Address not found", 404);
      }
      return NextResponse.json(
        {
          success: true,
          address: updatedAddress,
          message: "Address updated successfully",
        },
        { status: 200 }
      );
    } else {
      return authResult;
    }
  } catch (error) {
    console.error("Error updating address:", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return createNextResponse(false, message, 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    const authResult = await checkUserAuthentication();
    if ("user" in authResult) {
      const userId = authResult.user._id;
      const { addressId } = await req.json();

      const deletedAddress = await AddressModel.findOneAndDelete({
        _id: addressId,
        userId,
      });

      if (!deletedAddress) {
        return createNextResponse(false, "Address not found", 404);
      }

      // If the deleted address was the default, set a new default
      if (deletedAddress.isDefault) {
        const newDefault = await AddressModel.findOne({ userId });
        if (newDefault) {
          newDefault.isDefault = true;
          await newDefault.save();
        }
      }

      return createNextResponse(true, "Address deleted successfully", 200);
    } else {
      return authResult;
    }
  } catch (error) {
    console.error("Error deleting address:", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return createNextResponse(false, message, 500);
  }
}
