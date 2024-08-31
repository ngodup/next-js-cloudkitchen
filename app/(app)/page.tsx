// app/(app)/page.tsx
import { headers } from "next/headers";
import PageContainer from "@/components/layout/page-container";
import HomePageClient from "./components/HomePageClient";

async function fetchProducts(page = 1, limit = 12) {
  try {
    const headersList = headers();
    const protocol = headersList.get("x-forwarded-proto") || "http";
    const host = headersList.get("host") || "localhost:3000";

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
      products: [],
      pagination: { currentPage: 1, totalPages: 1, totalProducts: 0 },
    };
  }
}

export default async function HomePage() {
  const initialData = await fetchProducts();

  return (
    <PageContainer scrollable={true}>
      <HomePageClient initialData={initialData} />
    </PageContainer>
  );
}
