"use client"

import { useCallback, useMemo } from "react"
import type { NotePaneData } from "@/lib/types"
import { useNoteStackContext } from "./note-stack-provider"

interface MobileOrchestratorProps {
  initialPanesData: NotePaneData[]
}

export function useMobileData({ initialPanesData }: MobileOrchestratorProps) {
  const { stack, pushNote, setStack } = useNoteStackContext()

  const handleLinkClick = useCallback(
    (slug: string, fromPaneIndex: number) => {
      pushNote(slug, fromPaneIndex)
    },
    [pushNote]
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

  return useMemo(
    () => ({
      panes: initialPanesData,
      onLinkClick: handleLinkClick,
      onClose: handleClosePane,
    }),
    [initialPanesData, handleLinkClick, handleClosePane]
  )
}
