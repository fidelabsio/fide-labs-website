import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "./lib/routes";
import SiteProviders from "./components/SiteProviders";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Intercom from "./components/Intercom";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FIDE Request Quote Hide Price",
    template: "%s · FIDE Labs",
  },
  description:
    "FIDE is a Shopify app for B2B and wholesale merchants. Add a Request a Quote button, hide prices from guests, and manage every quote request from one clean dashboard. No code.",
  applicationName: "FIDE Labs",
  keywords: [
    "Shopify request a quote",
    "Shopify hide price",
    "B2B Shopify app",
    "wholesale quoting",
    "RFQ Shopify",
    "quote request form",
  ],
  authors: [{ name: "FIDE Labs" }],
  creator: "FIDE Labs",
  publisher: "FIDE Labs (OPC) Private Limited",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    siteName: "FIDE Labs",
    url: SITE_URL,
    title: "FIDE Request Quote Hide Price",
    description:
      "Add a Request a Quote button, hide prices from guests, and manage every quote request from one clean dashboard. Built for B2B and wholesale Shopify merchants.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "FIDE — B2B quoting for Shopify" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FIDE Request Quote Hide Price",
    description:
      "Add a Request a Quote button, hide prices from guests, and manage quote requests from one dashboard.",
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  themeColor: "#2F54EB",
  width: "device-width",
  initialScale: 1,
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "FIDE Labs",
  legalName: "FIDE LABS (OPC) PRIVATE LIMITED",
  url: SITE_URL,
  logo: `${SITE_URL}/icon`,
  email: "support@fidelabs.io",
  description:
    "FIDE Labs builds FIDE, a Shopify app that lets B2B and wholesale merchants collect quote requests and hide prices.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteProviders>
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
        </SiteProviders>
        <Intercom />
      </body>
    </html>
  );
}
