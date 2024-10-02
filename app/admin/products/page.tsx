import { cookies } from "next/headers";
import ProductsClient from "./ProductsClient";

export const dynamic = "force-dynamic";

//Server side rendering
async function getProducts(page = 1, cuisine = "", search = "") {
  const baseUrl =
    process.env.NEXTAUTH_URL ||
    process.env.NEXT_PUBLIC_DOMAIN ||
    "https://tamo-cloudkitchen.vercel.app";
  const res = await fetch(
    `${baseUrl}/api/admin/products?page=${page}&cuisine=${cuisine}&search=${search}`,
    {
      headers: {
        Cookie: cookies().toString(),
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

export default async function ProductsPage() {
  try {
    const initialData = await getProducts();
    return <ProductsClient initialData={initialData} />;
  } catch (error) {
    console.error("Error fetching products:", error);
    return <div>Error loading products. Please try again later.</div>;
  }
}
