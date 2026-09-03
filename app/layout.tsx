import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://kbos.io"),

  title: "KBOS  Replay-First Operational Continuity Infrastructure",

  description:
    "Replay-first operational continuity infrastructure with proof-safe review posture, replay-linked evidence visibility, bounded governance framing, and manual-review institutional evaluation.",

  openGraph: {
    title:
      "KBOS  Replay-First Operational Continuity Infrastructure",

    description:
      "Replay-first operational continuity infrastructure with proof-safe institutional review posture.",

    url: "https://kbos.io",

    siteName: "KBOS",

    images: [
      {
        url: "/og-default-1200x630.png",
        width: 1200,
        height: 630,
        alt: "KBOS Operational Continuity"
      }
    ],

    locale: "en_US",
    type: "website"
  },

  twitter: {
    card: "summary_large_image",
    title:
      "KBOS  Replay-First Operational Continuity Infrastructure",

    description:
      "Replay-first operational continuity infrastructure with proof-safe institutional review posture.",

    images: ["/og-default-1200x630.png"]
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],

    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png"
      }
    ]
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
