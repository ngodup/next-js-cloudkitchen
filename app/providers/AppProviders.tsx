// components/layout/providers.tsx
"use client";

import React from "react";
import store from "@/store";
import { Provider as ReduxProvider } from "react-redux";
import AuthProvider from "@/context/AuthProvider";
import { ProductsProvider } from "@/context/ProductsContext";
import ThemeProvider from "./themeToggle/theme-provider";

interface AppProvidersProps {
  children: React.ReactNode;
}
export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <AuthProvider>
          <ProductsProvider
            initialData={{
              products: [],
              pagination: { currentPage: 1, totalPages: 1, totalProducts: 0 },
            }}
          >
            {children}
          </ProductsProvider>
        </AuthProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}
