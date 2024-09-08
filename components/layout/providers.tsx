// components/layout/providers.tsx
"use client";

import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import ThemeProvider from "./themeToggle/theme-provider";
import AuthProvider from "@/context/AuthProvider";
import { ProductsProvider } from "@/context/ProductsContext";
import store from "@/store";

export default function Providers({ children }: { children: React.ReactNode }) {
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
