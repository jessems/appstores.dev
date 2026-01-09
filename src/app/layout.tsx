import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Header, Footer } from "@/components/layout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "appstores.dev - The App Store Directory",
    template: "%s | appstores.dev",
  },
  description:
    "Discover and compare app stores. Find the best platform to publish your apps with detailed information on fees, features, and submission processes.",
  keywords: [
    "app stores",
    "app distribution",
    "Google Play",
    "Apple App Store",
    "app publishing",
    "developer fees",
    "app marketplace",
  ],
  authors: [{ name: "appstores.dev" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://appstores.dev",
    siteName: "appstores.dev",
    title: "appstores.dev - The App Store Directory",
    description:
      "Discover and compare app stores. Find the best platform to publish your apps.",
  },
  twitter: {
    card: "summary_large_image",
    title: "appstores.dev - The App Store Directory",
    description:
      "Discover and compare app stores. Find the best platform to publish your apps.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VW69QEW4BG"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VW69QEW4BG');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
