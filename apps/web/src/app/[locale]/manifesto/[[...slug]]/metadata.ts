import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { hasLocale } from "next-intl"
import { getTranslations } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { getAllNoteSlugs, getNoteBySlug } from "@/lib/notes"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>
}): Promise<Metadata> {
  const { locale, slug } = await params

  if (!hasLocale(routing.locales, locale)) {
    return {}
  }

  const rootSlug = slug?.[0] ?? "index"
  const note = await getNoteBySlug(rootSlug, locale)

  if (!note) {
    const t = await getTranslations({ locale, namespace: "metadata" })
    return {
      title: t("title"),
      description: t("description"),
    }
  }

  const title = note.title
  const description = note.description || note.excerpt

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      locale,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description || "")}&locale=${locale}`,
          width: 2400,
          height: 1260,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        `/api/og?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description || "")}&locale=${locale}`,
      ],
    },
  }
}

export async function generateStaticParams() {
  const slugs = await getAllNoteSlugs(routing.defaultLocale)

  const params: Array<{ locale: string; slug: string[] | undefined }> = []
  for (const locale of routing.locales) {
    params.push({ locale, slug: undefined })
    for (const slug of slugs) {
      params.push({ locale, slug: [slug] })
    }
  }

  return params
}
