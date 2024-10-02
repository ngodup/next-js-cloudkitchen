import { headers } from "next/headers";
import HomePageWrapper from "@/components/HomePageWrapper";

//  Server-Side Rendering (SSR): This page uses SSR to fetch initial data, which is great for performance and SEO.
async function fetchProducts(page = 1, limit = 12) {
  try {
    const headersList = headers();
    const protocol = headersList.get("x-forwarded-proto") || "http";
    const host = headersList.get("host") || process.env.NEXT_PUBLIC_DOMAIN;

    const apiUrl = `${protocol}://${host}/api/products?page=${page}&limit=${limit}`;

    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch products");

    return await res.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: true,
      message: "Unable to retrieve products at this time",
      products: [],
      pagination: { currentPage: 1, totalPages: 1, totalProducts: 0 },
    };
  }
}
export default async function HomePage() {
  try {
    const initialData = await fetchProducts();
    return <HomePageWrapper initialData={initialData} />;
  } catch (error) {
    console.error("Error in HomePage:", error);
    return <div>Error loading page. Please try again later.</div>;
  }
}
