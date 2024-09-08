// app/(app)/components/HomePageWrapper.tsx
"use client";

import React from "react";

import PageContainer from "@/components/layout/page-container";
import ErrorBoundary from "@/components/ErrorBoundary";
import HomePageClient from "@/app/(app)/components/HomePageClient";
import { ProductsProvider } from "@/context/ProductsContext";

interface HomePageWrapperProps {
  initialData: any;
}

export default function HomePageWrapper({ initialData }: HomePageWrapperProps) {
  return (
    <PageContainer scrollable={true}>
      <HomePageClient />
    </PageContainer>
  );
}
