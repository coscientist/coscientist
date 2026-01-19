import "server-only"

import matter from "gray-matter"
import { remark } from "remark"
import gfm from "remark-gfm"
import html from "remark-html"

export interface NoteFrontmatter {
  title: string
  description?: string
  sourceLocale?: string
  sourceHash?: string
  translatedAt?: string
  createdAt?: string
  updatedAt?: string
  [key: string]: unknown // Allow additional fields
}

export interface ParsedNote {
  data: NoteFrontmatter
  content: string
  contentHtml: string
}

const TITLE_LINE_REGEX = /^#\s+.+\n+/

export function parseFrontmatter(fileContents: string) {
  const { data, content } = matter(fileContents)
  return { data: data as NoteFrontmatter, content }
}

export async function parseMarkdown(fileContents: string): Promise<ParsedNote> {
  const { data, content } = parseFrontmatter(fileContents)

  const processedContent = await remark()
    .use(gfm)
    .use(html, { sanitize: false })
    .process(content)

  const contentHtml = processedContent.toString()

  return {
    data: data as NoteFrontmatter,
    content,
    contentHtml,
  }
}

export function generateExcerpt(content: string, maxLength = 300): string {
  const withoutTitle = content.replace(TITLE_LINE_REGEX, "")
  const plainText = withoutTitle
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#*_`[\]]/g, "")
    .replace(/\n+/g, " ")
    .trim()

  if (plainText.length <= maxLength) {
    return plainText
  }
  const truncated = plainText.slice(0, maxLength)
  const lastSpace = truncated.lastIndexOf(" ")
  return `${lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated}...`
}
