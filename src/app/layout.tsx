
import { ThemeProvider } from "next-themes";

import type { Metadata } from "next";
import { Inter, Barlow } from "next/font/google";
import "./globals.css";


const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const barlowFont = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ['500', '700']
});


export const metadata: Metadata = {
  title: "Vendora",
  description: "Ultimate marketplace, where diverse sellers meet endless shoppers",
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
          attribute='class'
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
