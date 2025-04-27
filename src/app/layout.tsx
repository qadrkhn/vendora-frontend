import { GoogleOAuthProvider } from "@react-oauth/google";

import { ThemeProvider } from "next-themes";

import type { Metadata } from "next";
import { Inter, Barlow } from "next/font/google";

import ThemeToaster from "@/components/shared/theme-toaster";

import "./globals.css";

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const barlowFont = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "Vendora",
  description:
    "Ultimate marketplace, where diverse sellers meet endless shoppers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${barlowFont.variable} ${interFont.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
          >
            <main>{children}</main>
            <ThemeToaster />
          </GoogleOAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
