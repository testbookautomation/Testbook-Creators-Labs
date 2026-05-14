import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Testbook Creator Lab | Earn by Making Videos",
  description: "Create short videos promoting Testbook Pass and earn money. Join India's student creator campaign.",
  manifest: "/manifest.json",
  applicationName: "Testbook Creator Lab",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0c1a5e",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
