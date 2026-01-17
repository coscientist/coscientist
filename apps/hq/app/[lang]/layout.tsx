import { defineI18nUI } from "fumadocs-ui/i18n"
import { RootProvider } from "fumadocs-ui/provider/next"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { hasLocale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import type { ReactNode } from "react"
import { routing } from "@/i18n/routing"
import { i18n } from "@/lib/i18n"
import "../global.css"

const { provider } = defineI18nUI(i18n, {
  translations: {
    en: {
      displayName: "English",
    },
    ko: {
      displayName: "한국어",
    },
  },
})

export const metadata: Metadata = {
  title: "Coscientist HQ",
  description: "Internal documentation and ADRs for Coscientist",
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ lang: locale }))
}

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  if (!hasLocale(routing.locales, lang)) {
    notFound()
  }

  setRequestLocale(lang)

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider i18n={provider(lang)}>{children}</RootProvider>
      </body>
    </html>
  )
}
