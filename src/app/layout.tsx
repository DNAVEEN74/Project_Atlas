import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./_providers/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://project-atlas-jek8.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "PrepLeague - SSC CGL, CHSL & Bank Exam Preparation",
    template: "%s | PrepLeague",
  },
  description: "Master SSC CGL, CHSL, and Bank exams with 10,000+ PYQs, conceptual explanations, speed drills, and sprint tests. Free practice platform for Quantitative Aptitude and Reasoning.",
  keywords: [
    "SSC CGL preparation",
    "SSC CHSL practice",
    "Bank exam questions",
    "Quantitative aptitude",
    "Reasoning practice",
    "Previous year questions",
    "PYQ practice",
    "aptitude test",
    "competitive exam preparation",
    "free mock test",
  ],
  authors: [{ name: "PrepLeague" }],
  creator: "PrepLeague",
  publisher: "PrepLeague",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "PrepLeague",
    title: "PrepLeague - SSC CGL, CHSL & Bank Exam Preparation",
    description: "Master SSC CGL, CHSL, and Bank exams with 10,000+ PYQs, conceptual explanations, speed drills, and sprint tests.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PrepLeague - Competitive Exam Preparation Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PrepLeague - SSC CGL, CHSL & Bank Exam Preparation",
    description: "Master SSC CGL, CHSL, and Bank exams with 10,000+ PYQs, conceptual explanations, speed drills, and sprint tests.",
    images: ["/og-image.png"],
  },
  verification: {
    // Add your verification codes here when you have them
    // google: "your-google-verification-code",
  },
  alternates: {
    canonical: BASE_URL,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

// JSON-LD Organization Schema
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "PrepLeague",
  url: BASE_URL,
  logo: `${BASE_URL}/logo-final.png`,
  description: "Free online platform for SSC CGL, CHSL, and Bank exam preparation with PYQs, explanations, and practice tests.",
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    availableLanguage: ["English", "Hindi"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
