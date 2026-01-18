"use client"

import { useMemo, useState } from "react"
import type { NoteSummary } from "@/lib/types"

interface UseNotesListStateProps {
  notes: NoteSummary[]
  currentStack: string[]
}

export function useNotesListState({
  notes,
  currentStack,
}: UseNotesListStateProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const stackIndexBySlug = useMemo(() => {
    const map = new Map<string, number>()
    for (let i = 0; i < currentStack.length; i += 1) {
      const slug = currentStack[i]
      if (!map.has(slug)) {
        map.set(slug, i)
      }
    }
    return map
  }, [currentStack])

  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) {
      return notes
    }

    const query = searchQuery.toLowerCase()
    return notes.filter((note) => {
      const titleMatch = note.title.toLowerCase().includes(query)
      const descMatch = note.description?.toLowerCase().includes(query)
      return titleMatch || descMatch
    })
  }, [notes, searchQuery])

  return {
    searchQuery,
    setSearchQuery,
    filteredNotes,
    stackIndexBySlug,
  }
}
