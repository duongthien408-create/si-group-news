import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SI News Hub - Immigration News",
  description: "Latest immigration news from USA, Australia, Canada, Europe, and more",
  keywords: ["immigration", "visa", "news", "SI Group", "định cư"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-white">
        {children}
      </body>
    </html>
  );
}
