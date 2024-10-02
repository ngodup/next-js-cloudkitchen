import { cookies } from "next/headers";
import ProductsClient from "./ProductsClient";

export const dynamic = "force-dynamic";

async function getProducts(page = 1, cuisine = "", search = "") {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const res = await fetch(
      `${baseUrl}/api/admin/products?page=${page}&cuisine=${cuisine}&search=${search}`,
      {
        headers: {
          Cookie: cookies().toString(),
        },
      }
    );

    if (!res.ok) {
      throw new Error(
        `Failed to fetch products: ${res.status} ${res.statusText}`
      );
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      message: "Unable to retrieve products at this time",
      products: [],
      pagination: { currentPage: 1, totalPages: 1, totalProducts: 0 },
    };
  }
}

export default async function ProductsPage() {
  try {
    const initialData = await getProducts();
    return <ProductsClient initialData={initialData} />;
  } catch (error) {
    console.error("Error in ProductsPage:", error);
    return <div>Error loading products. Please try again later.</div>;
  }
}
