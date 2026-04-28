import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ExpandMatrix",
  description: "AI agents, websites and AI business implementation",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
