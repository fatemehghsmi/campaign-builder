import type {
  Metadata,
} from "next";

import localFont from "next/font/local";

import StoreProvider from "./StoreProvider";

import "./globals.css";

const yekan = localFont({
  src: "./fonts/Yekan.woff2",
  variable: "--font-yekan",
  display: "swap",
  fallback: [
    "Tahoma",
    "Arial",
    "sans-serif",
  ],
});

export const metadata: Metadata = {
  title: "Campaign Builder",
  description:
    "Smart campaign builder",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: Readonly<RootLayoutProps>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={yekan.variable}
    >
      <body className={yekan.className}>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}