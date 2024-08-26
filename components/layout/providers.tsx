"use client";

import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import ThemeProvider from "./themeToggle/theme-provider";
import store from "@/store";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SessionProvider>{children}</SessionProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}
