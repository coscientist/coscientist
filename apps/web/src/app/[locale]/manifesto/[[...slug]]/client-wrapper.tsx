import { notFound } from "next/navigation"
import { parseStackFromParams } from "@/lib/stack"
import type { BacklinkInfo, Note, NotePaneData, NoteSummary } from "@/lib/types"
import { NotesPageClient } from "./client"

interface ClientWrapperProps {
  noteGraphPromise: Promise<{
    notes: Map<string, Note>
    backlinks: Map<string, BacklinkInfo[]>
  }>
  rootSlug: string
  locale: string
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function ClientWrapper({
  noteGraphPromise,
  rootSlug,
  locale,
  searchParams,
}: ClientWrapperProps) {
  const { notes, backlinks } = await noteGraphPromise

  const rootNote = notes.get(rootSlug)
  if (!rootNote) {
    notFound()
  }

  const urlSearchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(searchParams)) {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        for (const v of value) {
          urlSearchParams.append(key, v)
        }
      } else {
        urlSearchParams.set(key, value)
      }
    }
  }

  const { stack } = parseStackFromParams(rootSlug, urlSearchParams)

  const initialPanesData: NotePaneData[] = []
  for (const slug of stack) {
    const note = notes.get(slug)
    if (note) {
      initialPanesData.push({
        slug: note.slug,
        title: note.title,
        description: note.description,
        contentHtml: note.contentHtml,
        backlinks: backlinks.get(slug) || [],
      })
    }
  }

  if (initialPanesData.length === 0) {
    notFound()
  }

  const noteSummaries: NoteSummary[] = Array.from(notes.values()).map(
    (note) => ({
      slug: note.slug,
      title: note.title,
      description: note.description,
    })
  )
  noteSummaries.sort((a, b) => a.title.localeCompare(b.title, locale))

  return (
    <NotesPageClient
      initialPanesData={initialPanesData}
      noteSummaries={noteSummaries}
      rootSlug={rootSlug}
    />
  )
}
