import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wijesinghe Jewelers — Live Gold Rates",
  description: "Real-time 24K, 22K, and 21K gold price dashboard for Wijesinghe Jewelers, Sri Lanka.",
};

export const viewport: Viewport = {
  themeColor: "#08070a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
