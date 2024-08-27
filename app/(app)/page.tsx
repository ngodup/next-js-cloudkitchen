import PageContainer from "@/components/layout/page-container";
import HomePageClient from "./components/HomePageClient";

// Server-side function to fetch products during SSR
async function fetchProducts() {
  try {
    const res = await fetch("/api/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch products");

    const data = await res.json();
    return data.products || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// This is a Server Component, fetching products server-side for the initial render
export default async function HomePage() {
  // Fetch products on the server-side before rendering the page
  const initialProducts = await fetchProducts();

  return (
    <PageContainer scrollable={true}>
      <HomePageClient initialProducts={initialProducts} />
    </PageContainer>
  );
}
