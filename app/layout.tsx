import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/providers/AuthProvider";
import ReferralCapture from "@/components/ReferralCapture";
import ActivityTracker from "@/components/ActivityTracker";
import CookieBanner from "@/components/CookieBanner";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sportsmarketos.com";

export const metadata: Metadata = {
  title: "Sports Market OS — AI Intelligence Terminal for Sports Markets",
  description:
    "Live market intelligence, sharp money detection, liquidity analysis, AI commentary, and creator-ready sports market content — built for the next era of exchange-native sports trading.",
  openGraph: {
    title: "Sports Market OS — AI Intelligence Terminal for Sports Markets",
    description:
      "Live market intelligence, sharp money detection, liquidity analysis, AI commentary, and creator-ready sports market content.",
    url: BASE_URL,
    siteName: "Sports Market OS",
    images: [{ url: `${BASE_URL}/opengraph-image.png`, width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sports Market OS — AI Intelligence Terminal",
    description:
      "Live market intelligence, sharp money detection, liquidity analysis, and creator-ready sports market content.",
    images: [`${BASE_URL}/opengraph-image.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-white">
        <AuthProvider>
          <ReferralCapture />
          <ActivityTracker />
          {children}
          <CookieBanner />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
