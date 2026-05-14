import type { Metadata, Viewport } from "next";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://creatorlabs.testbook.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Testbook Creator Lab | Earn by Making Videos",
  description:
    "Join Testbook's official student creator campaign. Create short videos about your exam preparation journey, promote Testbook Pass, and earn verified UPI payouts.",
  applicationName: "Testbook Creator Lab",
  manifest: "/manifest.json",
  keywords: [
    "Testbook Creator Lab",
    "Testbook Pass",
    "student creator campaign",
    "earn money making videos",
    "government exam preparation",
    "UPI payout",
    "SSC CGL",
    "UPSC",
    "Railway exam",
    "Bank PO",
  ],
  authors: [{ name: "Testbook", url: "https://testbook.com" }],
  creator: "Testbook",
  publisher: "Testbook",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/favicon.png",
    shortcut: "/favicon.png",
  },
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "Testbook Creator Lab",
    title: "Testbook Creator Lab | Earn by Making Videos",
    description:
      "Create short videos about your exam prep journey, promote Testbook Pass, and earn verified UPI payouts. India's official student creator campaign.",
    images: [{ url: "/favicon.png", width: 192, height: 192, alt: "Testbook Creator Lab" }],
    locale: "en_IN",
  },
  twitter: {
    card: "summary",
    title: "Testbook Creator Lab | Earn by Making Videos",
    description:
      "Create short videos about your exam prep journey, promote Testbook Pass, and earn verified UPI payouts.",
    images: ["/favicon.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
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
