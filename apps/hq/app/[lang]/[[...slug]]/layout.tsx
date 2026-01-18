import { DocsLayout } from "fumadocs-ui/layouts/notebook"
import type { ReactNode } from "react"
import { source } from "@/lib/source"
import { baseOptions } from "../layout.config"

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  return (
    <DocsLayout
      {...baseOptions(lang)}
      sidebar={{ defaultOpenLevel: 1 }}
      tree={source.getPageTree(lang)}
    >
      {children}
    </DocsLayout>
  )
}
