"use client"

import { AnimatePresence, LayoutGroup } from "motion/react"
import { useCallback, useMemo, useState } from "react"
import { AllNotesList } from "@/components/all-notes-list"
import { NotePane } from "@/components/pane/note-pane"
import type { NotePaneData, NoteSummary } from "@/lib/types"
import { useNoteStackContext } from "./note-stack-provider"

interface PaneOrchestratorProps {
  initialPanesData: NotePaneData[]
  noteSummaries: NoteSummary[]
}

export function PaneOrchestrator({
  initialPanesData,
  noteSummaries,
}: PaneOrchestratorProps) {
  const { stack, focusIndex, pushNote, focusPane, setStack } =
    useNoteStackContext()
  const [keyboardFocusIndex, setKeyboardFocusIndex] = useState(() => focusIndex)

  const handleLinkClick = useCallback(
    (slug: string, fromPaneIndex: number) => {
      pushNote(slug, fromPaneIndex)
    },
    [pushNote]
  )

  const handleExpandPane = useCallback(
    (index: number) => {
      setKeyboardFocusIndex(index)
      if (index < stack.length) {
        focusPane(index)
      }
    },
    [focusPane, stack.length]
  )

  const handleAllNotesClick = useCallback(
    (slug: string) => {
      pushNote(slug, stack.length - 1)
    },
    [pushNote, stack.length]
  )

  const handleClosePane = useCallback(
    (index: number) => {
      if (index === 0 || stack.length <= 1) {
        return
      }
      const newStack = [...stack.slice(0, index), ...stack.slice(index + 1)]
      const newFocusIndex = Math.min(index, newStack.length - 1)
      setStack(newStack, newFocusIndex)
    },
    [stack, setStack]
  )

  return (
    <LayoutGroup>
      <AnimatePresence initial={false} mode="popLayout">
        {initialPanesData.map((pane, index) => (
          <NotePane
            backlinks={pane.backlinks}
            contentHtml={pane.contentHtml}
            description={pane.description}
            index={index}
            isClosable={index > 0}
            isFocused={index === keyboardFocusIndex}
            key={`pane-${index}-${pane.slug}`}
            onClose={() => handleClosePane(index)}
            onExpand={() => handleExpandPane(index)}
            onLinkClick={handleLinkClick}
            slug={pane.slug}
            title={pane.title}
          />
        ))}
        <AllNotesList
          currentStack={stack}
          index={initialPanesData.length}
          key="all-notes-list"
          notes={noteSummaries}
          onExpand={() => handleExpandPane(initialPanesData.length)}
          onNoteClick={handleAllNotesClick}
        />
      </AnimatePresence>
    </LayoutGroup>
  )
}
