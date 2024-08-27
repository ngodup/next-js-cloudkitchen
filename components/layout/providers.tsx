"use client";

import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import ThemeProvider from "./themeToggle/theme-provider";
import AuthProvider from "@/context/AuthProvider";
import store from "@/store";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}
