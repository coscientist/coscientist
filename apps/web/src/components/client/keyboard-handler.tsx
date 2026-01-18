"use client"

import { useCallback, useEffect, useState } from "react"
import { useKeyboardNavigation } from "@/hooks/use-keyboard-navigation"
import { useNoteStackContext } from "./note-stack-provider"

interface KeyboardHandlerProps {
  initialPanesLength: number
  onScrollToPane: (index: number) => void
}

export function KeyboardHandler({
  initialPanesLength,
  onScrollToPane,
}: KeyboardHandlerProps) {
  const { stack, focusIndex, popNote } = useNoteStackContext()
  const [keyboardFocusIndex, setKeyboardFocusIndex] = useState(() => focusIndex)

  useEffect(() => {
    const maxIndex = Math.max(0, initialPanesLength - 1)
    const nextIndex = Math.min(Math.max(0, focusIndex), maxIndex)
    setKeyboardFocusIndex((prev) => (prev === nextIndex ? prev : nextIndex))
  }, [focusIndex, initialPanesLength])

  useKeyboardNavigation({
    stackLength: stack.length,
    focusIndex: keyboardFocusIndex,
    maxFocusIndex: initialPanesLength,
    onFocusChange: setKeyboardFocusIndex,
    onPopStack: popNote,
    onScrollToPane,
  })

  return null
}
