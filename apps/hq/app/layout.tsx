import { RootProvider } from "fumadocs-ui/provider"
import type { Metadata } from "next"
import "./global.css"

export const metadata: Metadata = {
  title: "Coscientist HQ",
  description: "Internal documentation and ADRs for Coscientist",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  )
}
