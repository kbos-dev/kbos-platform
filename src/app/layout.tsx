import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KBOS | Governed Runtime Infrastructure",
  description:
    "KBOS is governed runtime infrastructure for deterministic execution, replayable systems, and operational observability.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}