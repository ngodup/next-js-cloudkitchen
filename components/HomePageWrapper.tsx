// app/(app)/components/HomePageWrapper.tsx
"use client";

import React from "react";

import PageContainer from "@/components/layout/page-container";
import HomePageClient from "./HomePageClient";

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
