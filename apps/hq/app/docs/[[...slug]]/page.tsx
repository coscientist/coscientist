import { DocsBody, DocsPage } from "fumadocs-ui/page"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { docs } from "@/.source/server"

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>
}) {
  const params = await props.params
  const path = params.slug?.join("/") || "index"
  const page = docs.find((doc) => doc.url === `/docs/${path}`)

  if (!page) {
    notFound()
  }

  return (
    <DocsPage>
      <DocsBody>
        <h1>{page.data.title}</h1>
        <div>Content placeholder - MDX rendering to be configured</div>
      </DocsBody>
    </DocsPage>
  )
}

export async function generateStaticParams() {
  return docs.map((doc) => ({
    slug: doc.url.replace("/docs/", "").split("/").filter(Boolean),
  }))
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>
}): Promise<Metadata> {
  const params = await props.params
  const path = params.slug?.join("/") || "index"
  const page = docs.find((doc) => doc.url === `/docs/${path}`)

  if (!page) {
    notFound()
  }

  return {
    title: page.data.title,
  }
}
