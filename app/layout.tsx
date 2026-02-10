import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl = "https://coldpitch-tau.vercel.app";

export const metadata: Metadata = {
  title: "ColdPitch — AI Cold Email Generator",
  description:
    "Paste a website URL, get 3 personalized cold emails in 30 seconds. Free, no signup required.",
  keywords: [
    "cold email",
    "AI email generator",
    "cold outreach",
    "sales email",
    "cold pitch",
    "email copywriting",
    "B2B outreach",
  ],
  authors: [{ name: "ColdPitch" }],
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "ColdPitch — AI Cold Email Generator",
    description:
      "Paste a website URL, get 3 personalized cold emails in 30 seconds. Free, no signup required.",
    url: siteUrl,
    siteName: "ColdPitch",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ColdPitch — AI Cold Email Generator",
    description:
      "Paste a website URL, get 3 personalized cold emails in 30 seconds. Free, no signup required.",
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
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
