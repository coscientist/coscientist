"use client"

import { Suspense, useCallback, useMemo, useRef } from "react"
import { PaneContainer } from "@/components/pane/container"
import { NotePreviewProvider } from "@/components/preview-link"
import { Spinner } from "@/components/ui/spinner"
import type { NotePaneData, NoteSummary } from "@/lib/types"
import { KeyboardHandler } from "./keyboard-handler"
import { useMobileData } from "./mobile-orchestrator"
import { NoteStackProvider } from "./note-stack-provider"
import { PaneOrchestrator } from "./pane-orchestrator"

interface NotesPageClientProps {
  rootSlug: string
  noteSummaries: NoteSummary[]
  initialPanesData: NotePaneData[]
}

function NotesContent({
  rootSlug,
  noteSummaries,
  initialPanesData,
}: NotesPageClientProps) {
  const scrollToPaneRef = useRef<((index: number) => void) | null>(null)

  const handleScrollToPane = useCallback((index: number) => {
    scrollToPaneRef.current?.(index)
  }, [])

  const summariesMap = useMemo(() => {
    const map = new Map<string, NoteSummary>()
    for (const summary of noteSummaries) {
      map.set(summary.slug, summary)
    }
    return map
  }, [noteSummaries])

  return (
    <NoteStackProvider rootSlug={rootSlug}>
      <KeyboardHandler
        initialPanesLength={initialPanesData.length}
        onScrollToPane={handleScrollToPane}
      />
      <NotePreviewProvider summariesMap={summariesMap}>
        <PaneContainer
          initialPanesData={initialPanesData}
          scrollToPaneRef={scrollToPaneRef}
        >
          <PaneOrchestrator
            initialPanesData={initialPanesData}
            noteSummaries={noteSummaries}
          />
        </PaneContainer>
      </NotePreviewProvider>
    </NoteStackProvider>
  )
}

export function NotesPageClient(props: NotesPageClientProps) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center bg-muted">
          <Spinner size="lg" />
        </div>
      }
    >
      <NotesContent {...props} />
    </Suspense>
  )
}
