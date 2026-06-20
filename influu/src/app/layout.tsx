import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: { default: "Influu.pk — Creator Escrow Platform", template: "%s | Influu.pk" },
  description: "Pakistan's first creator-brand escrow marketplace. Payment held securely, released when your content goes live.",
  keywords: ["influencer marketing", "Pakistan", "escrow", "creator platform", "brand deals"],
  openGraph: {
    title: "Influu.pk — Creator Escrow Platform",
    description: "Secure brand deals for Pakistani creators and brands.",
    url: "https://influu.pk",
    siteName: "Influu.pk",
    locale: "en_PK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Influu.pk",
    description: "Pakistan's first creator escrow platform",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="min-h-screen antialiased" style={{ background: "#07070F", color: "#F0F0FF" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
