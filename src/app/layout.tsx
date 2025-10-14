import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ExpandMatrix",
  description: "AI agents, websites and AI business implementation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
