import type React from "react";
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://coscientist.app"),
  title: "Coscientist",
  description:
    "Always-on AI for calm verification, knowledge sovereignty, and ScienceOps. Not AGI but close enough.",
  openGraph: {
    title: "Coscientist",
    description:
      "Always-on AI for calm verification, knowledge sovereignty, and ScienceOps.",
    siteName: "Coscientist",
  },
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return children;
}
