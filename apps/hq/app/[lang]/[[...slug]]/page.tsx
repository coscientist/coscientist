import type { TOCItemType } from "fumadocs-core/toc"
import { DocsBody, DocsPage } from "fumadocs-ui/page"
import type { MDXContent } from "mdx/types"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { source } from "@/lib/source"
import { getMDXComponents } from "@/mdx-components"

interface PageProps {
  params: Promise<{ lang: string; slug?: string[] }>
}

interface FumadocsMdxPageData {
  body: MDXContent
  toc: TOCItemType[]
}

export default async function Page({ params }: PageProps) {
  const { slug, lang } = await params
  const page = source.getPage(slug, lang)

  if (!page) {
    notFound()
  }

  const { body: MDX, toc } = page.data as FumadocsMdxPageData

  return (
    <DocsPage toc={toc}>
      <DocsBody>
        <h1>{page.data.title}</h1>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  )
}

export async function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, lang } = await params
  const page = source.getPage(slug, lang)

  if (!page) {
    notFound()
  }

  return {
    title: page.data.title,
    description: page.data.description,
  }
}
