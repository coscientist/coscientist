import type { PageTree } from "fumadocs-core/server"
import { docs } from "@/.source/server"

// Create page tree from docs collection
const pageTree: PageTree = {
  name: "Documentation",
  children: docs.getPages().map((page: any) => ({
    type: "page",
    name: page.data.title || page.url,
    url: page.url,
    ...page,
  })),
}

export const source = {
  pageTree,
  getPage: (slug?: string[]) => {
    const path = slug?.join("/") || "index"
    return docs.getPage([path])
  },
  getPages: () => docs.getPages(),
  generateParams: () =>
    docs.getPages().map((page: any) => ({
      slug: page.url.replace("/docs/", "").split("/").filter(Boolean),
    })),
}
