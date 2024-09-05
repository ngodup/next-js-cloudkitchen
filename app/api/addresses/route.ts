import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbConnect";
import { createApiResponse } from "@/types/ApiResponse";
import { authOptions } from "../auth/[...nextauth]/options";
import AddressModel, { Address } from "@/model/Address";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user?._id) {
      return NextResponse.json(
        createApiResponse<undefined>(false, "Not Authenticated", 401)
      );
    }

    const userId = session.user._id;
    const addresses = await AddressModel.find({ userId });

    return NextResponse.json(
      {
        success: true,
        message: "Addresses retrieved successfully",
        addresses,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving addresses:", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(createApiResponse<undefined>(false, message, 500));
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user?._id) {
      return NextResponse.json(
        createApiResponse<undefined>(false, "Not Authenticated", 401)
      );
    }

    const userId = session.user._id;
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
        addresss: savedAddress,
        message: "Address saved successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error saving address:", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(createApiResponse<undefined>(false, message, 500));
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user?._id) {
      return NextResponse.json(
        createApiResponse<undefined>(false, "Not Authenticated", 401)
      );
    }

    const userId = session.user._id;
    const { addressId, ...addressData } = await req.json();

    const updatedAddress = await AddressModel.findOneAndUpdate(
      { _id: addressId, userId },
      addressData,
      { new: true }
    );

    if (!updatedAddress) {
      return NextResponse.json(
        createApiResponse<undefined>(false, "Address not found", 404)
      );
    }
    return NextResponse.json(
      {
        success: true,
        addresss: updatedAddress,
        message: "Address updated successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating address:", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(createApiResponse<undefined>(false, message, 500));
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user?._id) {
      return NextResponse.json(
        createApiResponse<undefined>(false, "Not Authenticated", 401)
      );
    }

    const userId = session.user._id;
    const { addressId } = await req.json();

    const deletedAddress = await AddressModel.findOneAndDelete({
      _id: addressId,
      userId,
    });

    if (!deletedAddress) {
      return NextResponse.json(
        createApiResponse<undefined>(false, "Address not found", 404)
      );
    }

    // If the deleted address was the default, set a new default
    if (deletedAddress.isDefault) {
      const newDefault = await AddressModel.findOne({ userId });
      if (newDefault) {
        newDefault.isDefault = true;
        await newDefault.save();
      }
    }

    return NextResponse.json(
      createApiResponse<undefined>(true, "Address deleted successfully", 200)
    );
  } catch (error) {
    console.error("Error deleting address:", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(createApiResponse<undefined>(false, message, 500));
  }
}
