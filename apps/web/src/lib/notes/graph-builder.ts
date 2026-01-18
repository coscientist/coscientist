import type { BacklinkInfo, Note } from "@/lib/types"
import { extractExcerpt } from "./link-extractor"
import { loadAllNotes } from "./note-loader"

const graphCache = new Map<
  string,
  Promise<{ notes: Map<string, Note>; backlinks: Map<string, BacklinkInfo[]> }>
>()

async function buildNoteGraphUncached(locale: string): Promise<{
  notes: Map<string, Note>
  backlinks: Map<string, BacklinkInfo[]>
}> {
  const allNotes = await loadAllNotes(locale)
  const notes = new Map<string, Note>()
  const backlinks = new Map<string, BacklinkInfo[]>()

  for (const note of allNotes) {
    notes.set(note.slug, note)
    backlinks.set(note.slug, [])
  }

  for (const note of allNotes) {
    for (const targetSlug of note.outboundLinks) {
      if (notes.has(targetSlug)) {
        const targetBacklinks = backlinks.get(targetSlug) || []
        targetBacklinks.push({
          slug: note.slug,
          title: note.title,
          excerpt: extractExcerpt(note.content, targetSlug),
        })
        backlinks.set(targetSlug, targetBacklinks)

        const targetNote = notes.get(targetSlug)
        if (targetNote && !targetNote.inboundLinks.includes(note.slug)) {
          targetNote.inboundLinks.push(note.slug)
        }
      }
    }
  }

  return { notes, backlinks }
}

export function buildNoteGraph(locale = "en"): Promise<{
  notes: Map<string, Note>
  backlinks: Map<string, BacklinkInfo[]>
}> {
  if (!graphCache.has(locale)) {
    graphCache.set(locale, buildNoteGraphUncached(locale))
  }
  return graphCache.get(locale)!
}
