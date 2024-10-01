import type { Metadata } from "next";
import Head from "next/head";
import { Toaster } from "@/components/ui/toaster";
import AppProviders from "./providers/AppProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cloud kitchen using Nextjs shadcn",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link
          rel="preload"
          href="/_next/static/css/app/(app)/layout.css"
          as="style"
        />
      </Head>
      <body>
        <AppProviders>{children}</AppProviders>
        <Toaster />
      </body>
    </html>
  );
}
