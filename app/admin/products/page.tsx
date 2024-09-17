import { cookies } from "next/headers";
import ProductsClient from "./ProductsClient";

//  Server-Side Rendering (SSR): This page uses SSR to fetch initial data, which is great for performance and SEO.
async function getProducts(page = 1, cuisine = "", search = "") {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/admin/products?page=${page}&cuisine=${cuisine}&search=${search}`,
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
  const initialData = await getProducts();

  return <ProductsClient initialData={initialData} />;
}
