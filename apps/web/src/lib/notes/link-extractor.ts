export function extractOutboundLinks(content: string): string[] {
  const links: Set<string> = new Set()

  const mdLinkRegex = /\[([^\]]+)\]\(\.?\/?([a-z0-9-]+)(?:\.md)?\)/gi
  const mdMatches = content.matchAll(mdLinkRegex)
  for (const match of mdMatches) {
    const slug = match[2]
    if (!(slug.startsWith("http") || slug.startsWith("mailto:"))) {
      links.add(slug)
    }
  }

  const wikiLinkRegex = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g
  const wikiMatches = content.matchAll(wikiLinkRegex)
  for (const match of wikiMatches) {
    links.add(match[1].toLowerCase().replace(/\s+/g, "-"))
  }

  return Array.from(links)
}

export function extractExcerpt(
  content: string,
  targetSlug: string
): string | undefined {
  const patterns = [
    new RegExp(`\\[([^\\]]+)\\]\\(\\.?\\/?${targetSlug}(?:\\.md)?\\)`, "i"),
    new RegExp(`\\[\\[${targetSlug}(?:\\|[^\\]]+)?\\]\\]`, "i"),
  ]

  for (const pattern of patterns) {
    const match = pattern.exec(content)
    if (match) {
      const index = match.index
      const start = Math.max(0, index - 50)
      const end = Math.min(content.length, index + match[0].length + 50)
      let excerpt = content.slice(start, end)

      if (start > 0) {
        excerpt = `...${excerpt}`
      }
      if (end < content.length) {
        excerpt = `${excerpt}...`
      }

      const targetLinkPattern = new RegExp(
        `\\[([^\\]]+)\\]\\(\\.?\\/?${targetSlug}(?:\\.md)?\\)`,
        "gi"
      )
      excerpt = excerpt.replace(targetLinkPattern, "**$1**")
      excerpt = excerpt.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      excerpt = excerpt.replace(/[#_`]/g, "").replace(/\n+/g, " ").trim()

      return excerpt
    }
  }

  return undefined
}
