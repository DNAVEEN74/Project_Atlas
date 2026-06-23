import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./_providers/providers";
import { CookieConsent } from '@/components/ui/CookieConsent';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: 'swap',
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://prepleague.in';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "PrepLeague - SSC CGL Exam Preparation",
    template: "%s | PrepLeague",
  },
  description: "Master SSC CGL with 3,000+ real PYQs, conceptual AI explanations, high-intensity Sprint drills, and precision analytics. The elite practice platform for Quantitative Aptitude and Reasoning.",
  keywords: [
    "SSC CGL preparation",
    "SSC CGL PYQ",
    "Quantitative aptitude",
    "Reasoning practice",
    "Previous year questions",
    "PYQ practice",
    "aptitude test",
    "competitive exam preparation",
    "mock test",
    "SSC CGL 2024",
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
    title: "PrepLeague - SSC CGL Preparation Platform",
    description: "Master SSC CGL with 3,000+ real PYQs, AI explanations, Sprint drills, and analytics.",
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
    title: "PrepLeague - SSC CGL Preparation Platform",
    description: "Master SSC CGL with 3,000+ real PYQs, AI explanations, Sprint drills, and analytics.",
    images: ["/og-image.png"],
  },
  verification: {
    // TODO: Get this from Google Search Console → Add Property → HTML tag method
    // google: "paste-your-code-here",
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
  description: "Elite online platform for SSC CGL, CHSL, and Bank exam preparation with PYQs, explanations, and practice tests.",
  sameAs: [
    // Add your social profiles here as you create them
    // "https://twitter.com/prepleague",
    // "https://instagram.com/prepleague",
  ],
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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          {children}
          <CookieConsent />
        </Providers>
      </body>
    </html>
  );
}
