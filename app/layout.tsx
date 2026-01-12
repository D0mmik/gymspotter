import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { LocaleProvider } from "@/components/LocaleProvider";
import { PostHogProvider } from "@/components/PostHogProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gym Spotter - Find Gyms in Prague",
  description: "Discover the best gyms and fitness centers in Prague. Interactive map with real-time information, ratings, and contact details for all gyms in Prague.",
  keywords: ["gym", "fitness", "Prague", "fitcentrum", "posilovna", "Praha", "workout", "gym finder"],
  authors: [{ name: "Gym Spotter" }],
  creator: "Gym Spotter",
  publisher: "Gym Spotter",
  applicationName: "Gym Spotter",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Gym Spotter",
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    alternateLocale: "en_US",
    title: "Gym Spotter - Find Gyms in Prague",
    description: "Discover the best gyms and fitness centers in Prague. Interactive map with real-time information.",
    siteName: "Gym Spotter",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gym Spotter - Find Gyms in Prague",
    description: "Discover the best gyms and fitness centers in Prague.",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className="dark">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/web-app-manifest-192x192.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PostHogProvider>
          <ConvexClientProvider>
            <LocaleProvider>{children}</LocaleProvider>
          </ConvexClientProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
