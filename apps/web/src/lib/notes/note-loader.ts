import type { Note } from "@/lib/types"
import { getAllNoteSlugs, readNoteFile } from "./file-io"
import { extractOutboundLinks } from "./link-extractor"
import { generateExcerpt, parseMarkdown } from "./markdown-parser"

export async function loadNote(
  slug: string,
  locale = "en"
): Promise<Note | null> {
  const fileContents = await readNoteFile(slug, locale)
  if (!fileContents) return null

  const { data, content, contentHtml } = await parseMarkdown(fileContents)
  const outboundLinks = extractOutboundLinks(content)
  const excerpt = generateExcerpt(content)

  return {
    slug,
    title: data.title || slug,
    description: data.description,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    content,
    contentHtml,
    excerpt,
    outboundLinks,
    inboundLinks: [],
  }
}

export async function loadAllNotes(locale = "en"): Promise<Note[]> {
  const slugs = await getAllNoteSlugs(locale)
  const notes = await Promise.all(slugs.map((slug) => loadNote(slug, locale)))
  return notes.filter((note): note is Note => note !== null)
}
