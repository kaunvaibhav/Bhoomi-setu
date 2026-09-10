import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "BhoomiSetu — Real-Time National Land Acquisition & Management System",
  description:
    "BhoomiSetu is a Government of India digital platform under the Ministry of Rural Development, Department of Land Resources (DoLR) for end-to-end land acquisition monitoring, GIS visualization, compensation management, and citizen transparency. Smart India Hackathon 2026 Prototype.",
  keywords: [
    "land acquisition",
    "BhoomiSetu",
    "Government of India",
    "Ministry of Rural Development",
    "Department of Land Resources",
    "DoLR",
    "SIH 2026",
    "RFCTLARR",
  ],
  authors: [{ name: "BhoomiSetu Team" }],
  robots: "noindex, nofollow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

